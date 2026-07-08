// zoo.js — View your animal collection

import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getZooData } from '../../services/whiscy/inventoryService.js';
import { getAnimalById, RARITY, RARITY_EMOJI } from '../../services/whiscy/animalData.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';
import { handleInteractionError } from '../../utils/errorHandler.js';
import { logger } from '../../utils/logger.js';

const RARITY_ORDER = [
  RARITY.MYTHICAL,
  RARITY.LEGENDARY,
  RARITY.SUPER_RARE,
  RARITY.RARE,
  RARITY.UNCOMMON,
  RARITY.COMMON,
];

export default {
  data: new SlashCommandBuilder()
    .setName('zoo')
    .setDescription('View your animal collection!')
    .addUserOption(option =>
      option.setName('user').setDescription('View another user\'s zoo').setRequired(false)
    )
    .setDMPermission(false),
  category: 'Economy',
  prefixSupport: true,

  async execute(interaction, config, client) {
    try {
      await InteractionHelper.safeDefer(interaction);

      const targetUser = interaction.options.getUser('user') || interaction.user;
      const zoo = await getZooData(client, interaction.guildId, targetUser.id);
      const entries = Object.entries(zoo).filter(([, count]) => count > 0);

      if (entries.length === 0) {
        const embed = new EmbedBuilder()
          .setColor('#95a5a6')
          .setTitle(`🏛️ ${targetUser.username}'s Zoo`)
          .setDescription('No animals yet! Use `/hunt` to start catching.')
          .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }));
        await InteractionHelper.safeEditReply(interaction, { embeds: [embed] });
        return;
      }

      // Group by rarity
      const grouped = {};
      let totalCount = 0;

      for (const [animalId, count] of entries) {
        const animal = getAnimalById(animalId);
        if (!animal) continue;

        if (!grouped[animal.rarity]) grouped[animal.rarity] = [];
        grouped[animal.rarity].push({ animal, count });
        totalCount += count;
      }

      // Build description
      let description = '';

      for (const rarity of RARITY_ORDER) {
        const animals = grouped[rarity];
        if (!animals || animals.length === 0) continue;

        const totalInRarity = animals.reduce((sum, a) => sum + a.count, 0);
        description += `\n${RARITY_EMOJI[rarity]} **${rarity}** (${totalInRarity})\n`;

        for (const { animal, count } of animals) {
          description += `${animal.emoji} ${animal.name} x${count}\n`;
        }
      }

      const embed = new EmbedBuilder()
        .setColor('#3498db')
        .setTitle(`🏛️ ${targetUser.username}'s Zoo`)
        .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
        .setDescription(description.trim())
        .setFooter({ text: `Total Animals: ${totalCount}` });

      await InteractionHelper.safeEditReply(interaction, { embeds: [embed] });
    } catch (error) {
      logger.error('Zoo command error:', error);
      await handleInteractionError(interaction, error, { type: 'command', commandName: 'zoo' });
    }
  },
};
