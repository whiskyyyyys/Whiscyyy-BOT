// inventoryService.js — Data access layer for whiscy economy, zoo, buffs, and items

import { logger } from '../../utils/logger.js';

// ─── Whiscy User Data ───────────────────────────────────────────────

const DEFAULT_WHISCY_DATA = {
  wallet: 0,
  lastDaily: 0,
  dailyStreak: 0,
  lastHunt: 0,
  lastBattle: 0,
  huntCount: 0,
  battleWins: 0,
  battleLosses: 0,
  items: [],
};

export async function getWhiscyData(client, guildId, userId) {
  try {
    const key = `guild:${guildId}:whiscy:user:${userId}`;
    const data = await client.db.get(key);
    return { ...DEFAULT_WHISCY_DATA, ...data };
  } catch (error) {
    logger.error(`Failed to get whiscy data for ${userId}:`, error);
    return { ...DEFAULT_WHISCY_DATA };
  }
}

export async function setWhiscyData(client, guildId, userId, data) {
  try {
    const key = `guild:${guildId}:whiscy:user:${userId}`;
    await client.db.set(key, data);
  } catch (error) {
    logger.error(`Failed to save whiscy data for ${userId}:`, error);
    throw error;
  }
}

// ─── Zoo Data ────────────────────────────────────────────────────────

export async function getZooData(client, guildId, userId) {
  try {
    const key = `guild:${guildId}:whiscy:zoo:${userId}`;
    const data = await client.db.get(key);
    return data || {};
  } catch (error) {
    logger.error(`Failed to get zoo data for ${userId}:`, error);
    return {};
  }
}

export async function setZooData(client, guildId, userId, data) {
  try {
    const key = `guild:${guildId}:whiscy:zoo:${userId}`;
    await client.db.set(key, data);
  } catch (error) {
    logger.error(`Failed to save zoo data for ${userId}:`, error);
    throw error;
  }
}

// ─── Buff Data ───────────────────────────────────────────────────────

const DEFAULT_BUFF = { value: 0, remaining: 0, expiresAt: 0 };

export async function getBuffData(client, guildId, userId) {
  try {
    const key = `guild:${guildId}:whiscy:buffs:${userId}`;
    const data = await client.db.get(key);
    return data || {};
  } catch (error) {
    logger.error(`Failed to get buff data for ${userId}:`, error);
    return {};
  }
}

export async function setBuffData(client, guildId, userId, data) {
  try {
    const key = `guild:${guildId}:whiscy:buffs:${userId}`;
    await client.db.set(key, data);
  } catch (error) {
    logger.error(`Failed to save buff data for ${userId}:`, error);
    throw error;
  }
}

/**
 * Apply a buff to a user.
 */
export async function applyBuff(client, guildId, userId, buffType, value, uses = 0, durationMs = 0) {
  const buffs = await getBuffData(client, guildId, userId);

  buffs[buffType] = {
    value,
    remaining: uses,
    expiresAt: durationMs > 0 ? Date.now() + durationMs : 0,
  };

  await setBuffData(client, guildId, userId, buffs);
  logger.info(`[BUFF] Applied ${buffType} to ${userId} (value=${value}, uses=${uses}, duration=${durationMs}ms)`);
}

/**
 * Consume one use of a use-based buff.
 */
export async function consumeBuff(client, guildId, userId, buffType) {
  const buffs = await getBuffData(client, guildId, userId);

  if (!buffs[buffType]) return;

  if (buffs[buffType].remaining > 0) {
    buffs[buffType].remaining -= 1;

    if (buffs[buffType].remaining <= 0) {
      delete buffs[buffType];
      logger.info(`[BUFF] ${buffType} expired for ${userId} (uses depleted)`);
    }
  }

  await setBuffData(client, guildId, userId, buffs);
}

// ─── Utility ─────────────────────────────────────────────────────────

export function formatWhiscy(amount) {
  return `${amount.toLocaleString()} whiscy 🪙`;
}

export function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}
