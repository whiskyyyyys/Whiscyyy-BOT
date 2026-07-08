// battleService.js — PvE Battle logic for the Whiscy system

import { logger } from '../../utils/logger.js';
import {
  getAnimalById,
  getAnimalStats,
  rollMonster,
  RARITY_EMOJI,
  RARITY_COLORS,
  RARITY,
} from './animalData.js';
import { getWhiscyData, setWhiscyData, getZooData, getBuffData, consumeBuff } from './inventoryService.js';

const BATTLE_COOLDOWN_MS = 30_000;

/**
 * Get the user's strongest animal from their zoo.
 */
export async function getBestAnimal(client, guildId, userId) {
  const zoo = await getZooData(client, guildId, userId);
  const entries = Object.entries(zoo).filter(([, count]) => count > 0);

  if (entries.length === 0) return null;

  const RARITY_ORDER = [RARITY.MYTHICAL, RARITY.LEGENDARY, RARITY.SUPER_RARE, RARITY.RARE, RARITY.UNCOMMON, RARITY.COMMON];

  let best = null;
  let bestRarityIndex = RARITY_ORDER.length;

  for (const [animalId] of entries) {
    const animal = getAnimalById(animalId);
    if (!animal) continue;

    const idx = RARITY_ORDER.indexOf(animal.rarity);
    if (idx < bestRarityIndex) {
      bestRarityIndex = idx;
      best = animal;
    }
  }

  return best;
}

/**
 * Perform a PvE battle.
 * @param {string} [animalId] Specific animal to use, or null for auto-best.
 */
export async function performBattle(client, guildId, userId, animalId = null) {
  const data = await getWhiscyData(client, guildId, userId);
  const now = Date.now();

  // Cooldown check
  const lastBattle = data.lastBattle || 0;
  const remaining = lastBattle + BATTLE_COOLDOWN_MS - now;
  if (remaining > 0) {
    return {
      success: false,
      reason: 'cooldown',
      remaining,
      formatted: formatMs(remaining),
    };
  }

  // Get animal
  let animal;
  if (animalId) {
    const zoo = await getZooData(client, guildId, userId);
    if (!zoo[animalId] || zoo[animalId] <= 0) {
      return { success: false, reason: 'no_animal', message: "You don't have that animal!" };
    }
    animal = getAnimalById(animalId);
  } else {
    animal = await getBestAnimal(client, guildId, userId);
  }

  if (!animal) {
    return {
      success: false,
      reason: 'no_animals',
      message: 'You have no animals! Use `/hunt` first to catch some.',
    };
  }

  // Get stats
  const animalStats = getAnimalStats(animal);
  let userAtk = animalStats.atk + Math.floor(Math.random() * 20) + 1;
  const userHp = animalStats.hp;

  // Check battle ATK buff
  const buffs = await getBuffData(client, guildId, userId);
  let hadAtkBuff = false;
  if (buffs.battle_atk && buffs.battle_atk.remaining > 0) {
    userAtk += buffs.battle_atk.value;
    hadAtkBuff = true;
  }

  // Generate monster
  const monster = rollMonster();
  const monsterLevel = Math.floor(Math.random() * (monster.maxLevel - monster.minLevel + 1)) + monster.minLevel;
  const monsterAtk = Math.floor(monsterLevel * 1.5) + Math.floor(Math.random() * 15) + 1;
  const monsterHp = Math.floor(monsterLevel * 2) + 10;

  // Battle calculation
  const userTotal = userAtk + Math.floor(userHp * 0.3);
  const monsterTotal = monsterAtk + Math.floor(monsterHp * 0.3);
  const won = userTotal >= monsterTotal;

  // Whiscy reward if won
  let whiscyReward = 0;
  if (won) {
    whiscyReward = Math.floor(monsterLevel * 5) + Math.floor(Math.random() * 50) + 10;

    // Check whiscy boost
    if (buffs.whiscy_boost && buffs.whiscy_boost.expiresAt > now) {
      whiscyReward = Math.floor(whiscyReward * buffs.whiscy_boost.value);
    }

    data.wallet = (data.wallet || 0) + whiscyReward;
    data.battleWins = (data.battleWins || 0) + 1;
  } else {
    data.battleLosses = (data.battleLosses || 0) + 1;
  }

  data.lastBattle = now;
  await setWhiscyData(client, guildId, userId, data);

  // Consume battle buff if active
  if (hadAtkBuff) {
    await consumeBuff(client, guildId, userId, 'battle_atk');
  }

  logger.info(`[BATTLE] ${userId} ${won ? 'WON' : 'LOST'} vs ${monster.name} (Lv${monsterLevel})`, {
    guildId, userId, animal: animal.id, monster: monster.name, won, whiscy: whiscyReward,
  });

  return {
    success: true,
    won,
    animal,
    animalAtk: userAtk,
    animalHp: userHp,
    monster: { ...monster, level: monsterLevel, atk: monsterAtk, hp: monsterHp },
    whiscyReward,
    newBalance: data.wallet,
    rarityEmoji: RARITY_EMOJI[animal.rarity],
    rarityColor: won ? '#2ecc71' : '#e74c3c',
    hadAtkBuff,
  };
}

function formatMs(ms) {
  const seconds = Math.ceil(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}m ${secs}s`;
}
