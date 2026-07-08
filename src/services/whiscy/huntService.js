// huntService.js — Hunt logic for the Whiscy system

import { logger } from '../../utils/logger.js';
import { rollAnimal, getAnimalWhiscyValue, RARITY_EMOJI, RARITY_COLORS } from './animalData.js';
import { getWhiscyData, setWhiscyData, getZooData, setZooData, getBuffData, consumeBuff } from './inventoryService.js';

const HUNT_COOLDOWN_MS = 15_000;
const NOTHING_FOUND_CHANCE = 0.10;

export async function performHunt(client, guildId, userId) {
  const data = await getWhiscyData(client, guildId, userId);
  const now = Date.now();

  // Cooldown check
  const lastHunt = data.lastHunt || 0;
  const remaining = lastHunt + HUNT_COOLDOWN_MS - now;
  if (remaining > 0) {
    return {
      success: false,
      reason: 'cooldown',
      remaining,
      formatted: formatMs(remaining),
    };
  }

  // Check for hunt luck buff
  const buffs = await getBuffData(client, guildId, userId);
  let luckBonus = 0;
  if (buffs.hunt_luck && buffs.hunt_luck.remaining > 0) {
    luckBonus = buffs.hunt_luck.value;
  }

  // Nothing found chance (reduced by luck)
  const nothingChance = Math.max(0, NOTHING_FOUND_CHANCE - luckBonus * 0.002);
  if (Math.random() < nothingChance) {
    data.lastHunt = now;
    data.huntCount = (data.huntCount || 0) + 1;
    await setWhiscyData(client, guildId, userId, data);
    return { success: true, found: false };
  }

  // Roll an animal
  const animal = rollAnimal(luckBonus);
  let whiscyEarned = getAnimalWhiscyValue(animal);

  // Check whiscy boost
  if (buffs.whiscy_boost && buffs.whiscy_boost.expiresAt > now) {
    whiscyEarned = Math.floor(whiscyEarned * buffs.whiscy_boost.value);
  }

  // Update wallet
  data.wallet = (data.wallet || 0) + whiscyEarned;
  data.lastHunt = now;
  data.huntCount = (data.huntCount || 0) + 1;
  await setWhiscyData(client, guildId, userId, data);

  // Add animal to zoo
  const zoo = await getZooData(client, guildId, userId);
  zoo[animal.id] = (zoo[animal.id] || 0) + 1;
  await setZooData(client, guildId, userId, zoo);

  // Consume hunt luck buff if active
  if (buffs.hunt_luck && buffs.hunt_luck.remaining > 0) {
    await consumeBuff(client, guildId, userId, 'hunt_luck');
  }

  logger.info(`[HUNT] ${userId} caught ${animal.name} (${animal.rarity}) +${whiscyEarned} whiscy`, {
    guildId, userId, animal: animal.id, rarity: animal.rarity, whiscy: whiscyEarned,
  });

  return {
    success: true,
    found: true,
    animal,
    whiscyEarned,
    rarityEmoji: RARITY_EMOJI[animal.rarity],
    rarityColor: RARITY_COLORS[animal.rarity],
    newBalance: data.wallet,
    hadLuckBuff: luckBonus > 0,
  };
}

function formatMs(ms) {
  const seconds = Math.ceil(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}m ${secs}s`;
}
