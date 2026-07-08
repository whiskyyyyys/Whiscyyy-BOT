// balance.js — Check your whiscy balance

import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getWhiscyData, formatWhiscy } from '../../services/whiscy/inventoryService.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';
import { handleInteractionError } from '../../utils/errorHandler.js';
import { logger } from '../../utils/logger.js';

export default {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check your whiscy balance!')
    .addUserOption(option =>
      option.setName('user').setDescription('User to check').setRequired(false)
    )
    .setDMPermission(false),
  category: 'Economy',
  prefixSupport: true,

  async execute(interaction, config, client) {
    try {
      await InteractionHelper.safeDefer(interaction);

      const targetUser = interaction.options.getUser('user') || interaction.user;
      const data = await getWhiscyData(client, interaction.guildId, targetUser.id);

      const embed = new EmbedBuilder()
        .setColor('#f1c40f')
        .setTitle(`💰 ${targetUser.username}'s Balance`)
        .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
        .setDescription(`**${formatWhiscy(data.wallet || 0)}**`)
        .setTimestamp();

      await InteractionHelper.safeEditReply(interaction, { embeds: [embed] });
    } catch (error) {
      logger.error('Balance command error:', error);
      await handleInteractionError(interaction, error, { type: 'command', commandName: 'balance' });
    }
  },
};