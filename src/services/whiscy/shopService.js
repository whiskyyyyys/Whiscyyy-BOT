// shopService.js — Shop purchase logic for the Whiscy system

import { logger } from '../../utils/logger.js';
import { SHOP_ITEMS, getShopItem, rollAnimal, RARITY } from './animalData.js';
import { getWhiscyData, setWhiscyData, getZooData, setZooData, applyBuff, formatWhiscy } from './inventoryService.js';

/**
 * Purchase a shop item.
 */
export async function purchaseItem(client, guildId, userId, itemId) {
  const item = getShopItem(itemId);
  if (!item) {
    return { success: false, reason: 'not_found', message: 'Item not found in the shop.' };
  }

  const data = await getWhiscyData(client, guildId, userId);

  if ((data.wallet || 0) < item.price) {
    return {
      success: false,
      reason: 'insufficient_funds',
      message: `You need **${formatWhiscy(item.price)}** but only have **${formatWhiscy(data.wallet || 0)}**.`,
    };
  }

  // Deduct cost
  data.wallet -= item.price;

  let result = { success: true, item };

  if (item.type === 'buff') {
    // Apply buff
    await applyBuff(
      client, guildId, userId,
      item.buffType,
      item.buffValue,
      item.buffUses || 0,
      item.buffDuration || 0
    );
    result.message = `Applied **${item.emoji} ${item.name}**! ${item.description}`;
  } else if (item.type === 'instant' && item.action === 'mystery_box') {
    // Mystery Box — guarantee Rare+
    const rarityPool = [RARITY.RARE, RARITY.SUPER_RARE, RARITY.LEGENDARY, RARITY.MYTHICAL];
    const weights = [50, 30, 15, 5];
    const totalWeight = weights.reduce((s, w) => s + w, 0);
    let roll = Math.random() * totalWeight;
    let selectedRarity = RARITY.RARE;

    for (let i = 0; i < rarityPool.length; i++) {
      roll -= weights[i];
      if (roll <= 0) {
        selectedRarity = rarityPool[i];
        break;
      }
    }

    // Roll animal from selected rarity
    const animal = rollAnimal(0);
    // Override to guarantee rarity
    const { getAnimalsByRarity } = await import('./animalData.js');
    const pool = getAnimalsByRarity(selectedRarity);
    const mysteryAnimal = pool[Math.floor(Math.random() * pool.length)];

    // Add to zoo
    const zoo = await getZooData(client, guildId, userId);
    zoo[mysteryAnimal.id] = (zoo[mysteryAnimal.id] || 0) + 1;
    await setZooData(client, guildId, userId, zoo);

    result.animal = mysteryAnimal;
    result.message = `You opened a **🎁 Mystery Box** and found a **${mysteryAnimal.emoji} ${mysteryAnimal.name}** (${mysteryAnimal.rarity})!`;
  }

  await setWhiscyData(client, guildId, userId, data);

  logger.info(`[SHOP] ${userId} purchased ${item.name} for ${item.price} whiscy`, {
    guildId, userId, item: item.id, price: item.price,
  });

  result.newBalance = data.wallet;
  return result;
}

/**
 * Get shop items list.
 */
export function getShopItemsList() {
  return SHOP_ITEMS;
}
