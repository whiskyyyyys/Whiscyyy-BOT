// daily.js — Daily whiscy claim with streak bonus

import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getWhiscyData, setWhiscyData, formatWhiscy } from '../../services/whiscy/inventoryService.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';
import { handleInteractionError } from '../../utils/errorHandler.js';
import { logger } from '../../utils/logger.js';

const DAILY_COOLDOWN = 24 * 60 * 60 * 1000;
const STREAK_RESET_WINDOW = 48 * 60 * 60 * 1000;
const BASE_MIN = 200;
const BASE_MAX = 500;
const STREAK_BONUS = 50;
const MAX_STREAK_BONUS = 500;

export default {
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Claim your daily whiscy reward!')
    .setDMPermission(false),
  category: 'Economy',
  prefixSupport: true,

  async execute(interaction, config, client) {
    try {
      await InteractionHelper.safeDefer(interaction);

      const userId = interaction.user.id;
      const guildId = interaction.guildId;
      const now = Date.now();

      const data = await getWhiscyData(client, guildId, userId);
      const lastDaily = data.lastDaily || 0;
      const remaining = lastDaily + DAILY_COOLDOWN - now;

      if (remaining > 0) {
        const embed = new EmbedBuilder()
          .setColor('#e74c3c')
          .setDescription(`⏳ You already claimed your daily! Come back in **${formatDuration(remaining)}**.`);
        await InteractionHelper.safeEditReply(interaction, { embeds: [embed] });
        return;
      }

      // Streak logic
      let streak = data.dailyStreak || 0;
      if (lastDaily > 0 && now - lastDaily > STREAK_RESET_WINDOW) {
        streak = 0; // Reset streak if more than 48h since last claim
      }
      streak += 1;

      // Calculate reward
      const baseReward = Math.floor(Math.random() * (BASE_MAX - BASE_MIN + 1)) + BASE_MIN;
      const streakBonus = Math.min(streak * STREAK_BONUS, MAX_STREAK_BONUS);
      const totalReward = baseReward + streakBonus;

      // Update data
      data.wallet = (data.wallet || 0) + totalReward;
      data.lastDaily = now;
      data.dailyStreak = streak;

      await setWhiscyData(client, guildId, userId, data);

      logger.info(`[DAILY] ${userId} claimed ${totalReward} whiscy (streak: ${streak})`, {
        guildId, userId, reward: totalReward, streak,
      });

      const embed = new EmbedBuilder()
        .setColor('#2ecc71')
        .setTitle('📅 Daily Reward!')
        .setDescription(
          `+**${baseReward}** whiscy 🪙\n` +
          (streakBonus > 0
            ? `🔥 Streak: **${streak}** days (+${streakBonus} bonus)\n` +
              `💰 Total: **${totalReward}** whiscy\n`
            : '') +
          `\nBalance: **${formatWhiscy(data.wallet)}**`
        )
        .setFooter({ text: streak >= 2 ? `${streak} day streak! Don't break it!` : 'Come back tomorrow for a streak bonus!' });

      await InteractionHelper.safeEditReply(interaction, { embeds: [embed] });
    } catch (error) {
      logger.error('Daily command error:', error);
      await handleInteractionError(interaction, error, { type: 'command', commandName: 'daily' });
    }
  },
};

function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}