// profile.js — View user profile with level, whiscy, zoo stats, and battle record

import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getWhiscyData, getZooData, formatWhiscy } from '../../services/whiscy/inventoryService.js';
import { getAnimalById, RARITY, RARITY_EMOJI } from '../../services/whiscy/animalData.js';
import { getUserLevelData, getLevelingConfig, getXpForLevel } from '../../services/leveling.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';
import { handleInteractionError } from '../../utils/errorHandler.js';
import { logger } from '../../utils/logger.js';

const RARITY_ORDER = [RARITY.MYTHICAL, RARITY.LEGENDARY, RARITY.SUPER_RARE, RARITY.RARE, RARITY.UNCOMMON, RARITY.COMMON];

export default {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('View your or another user\'s profile!')
    .addUserOption(option =>
      option.setName('user').setDescription('User to view').setRequired(false)
    )
    .setDMPermission(false),
  category: 'Economy',
  prefixSupport: true,

  async execute(interaction, config, client) {
    try {
      await InteractionHelper.safeDefer(interaction);

      const targetUser = interaction.options.getUser('user') || interaction.user;
      const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);
      const guildId = interaction.guildId;

      // Get all data
      const [whiscyData, zoo, levelData] = await Promise.all([
        getWhiscyData(client, guildId, targetUser.id),
        getZooData(client, guildId, targetUser.id),
        getUserLevelData(client, guildId, targetUser.id),
      ]);

      // Level info
      const level = levelData?.level ?? 0;
      const xp = levelData?.xp ?? 0;
      const xpNeeded = getXpForLevel(level);
      const progress = xpNeeded > 0 ? Math.floor((xp / xpNeeded) * 100) : 0;
      const progressBar = createProgressBar(progress, 10);

      // Zoo stats
      const zooEntries = Object.entries(zoo).filter(([, count]) => count > 0);
      const totalAnimals = zooEntries.reduce((sum, [, count]) => sum + count, 0);

      // Find rarest animal
      let rarestAnimal = null;
      let rarestRarityIndex = RARITY_ORDER.length;
      for (const [animalId] of zooEntries) {
        const animal = getAnimalById(animalId);
        if (!animal) continue;
        const idx = RARITY_ORDER.indexOf(animal.rarity);
        if (idx < rarestRarityIndex) {
          rarestRarityIndex = idx;
          rarestAnimal = animal;
        }
      }

      // Battle stats
      const battleWins = whiscyData.battleWins || 0;
      const battleLosses = whiscyData.battleLosses || 0;
      const totalBattles = battleWins + battleLosses;
      const winRate = totalBattles > 0 ? Math.floor((battleWins / totalBattles) * 100) : 0;

      const embed = new EmbedBuilder()
        .setColor('#9b59b6')
        .setTitle(`👤 ${member?.displayName || targetUser.username}'s Profile`)
        .setThumbnail(targetUser.displayAvatarURL({ dynamic: true, size: 256 }))
        .addFields(
          {
            name: '📊 Level',
            value: `Level **${level}** (${xp.toLocaleString()}/${xpNeeded.toLocaleString()} XP)\n${progressBar} ${progress}%`,
            inline: false,
          },
          {
            name: '💰 Whiscy',
            value: formatWhiscy(whiscyData.wallet || 0),
            inline: true,
          },
          {
            name: '🏛️ Zoo',
            value: `${totalAnimals} animal${totalAnimals !== 1 ? 's' : ''}`,
            inline: true,
          },
          {
            name: '🏆 Rarest',
            value: rarestAnimal
              ? `${rarestAnimal.emoji} ${rarestAnimal.name} (${RARITY_EMOJI[rarestAnimal.rarity]} ${rarestAnimal.rarity})`
              : 'None yet',
            inline: true,
          },
          {
            name: '⚔️ Battles',
            value: totalBattles > 0
              ? `${totalBattles} (Win: ${battleWins} | Loss: ${battleLosses} | ${winRate}%)`
              : 'No battles yet',
            inline: false,
          },
          {
            name: '🌿 Hunts',
            value: `${(whiscyData.huntCount || 0).toLocaleString()}`,
            inline: true,
          },
          {
            name: '🔥 Daily Streak',
            value: `${whiscyData.dailyStreak || 0} day${(whiscyData.dailyStreak || 0) !== 1 ? 's' : ''}`,
            inline: true,
          }
        )
        .setTimestamp();

      await InteractionHelper.safeEditReply(interaction, { embeds: [embed] });
    } catch (error) {
      logger.error('Profile command error:', error);
      await handleInteractionError(interaction, error, { type: 'command', commandName: 'profile' });
    }
  },
};

function createProgressBar(percentage, length = 10) {
  const p = Math.max(0, Math.min(100, percentage));
  const filled = Math.round((p / 100) * length);
  return '█'.repeat(filled) + '░'.repeat(length - filled);
}
