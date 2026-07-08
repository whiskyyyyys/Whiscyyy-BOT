import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { leaveAndStop } from '../../services/voice247Service.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';
import { logger } from '../../utils/logger.js';

export default {
  data: new SlashCommandBuilder()
    .setName('leave')
    .setDescription('Makes the bot leave the voice channel and stop the 24/7 connection.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),
  category: 'Core',
  prefixSupport: true,

  async execute(interaction, config, client) {
    try {
      await InteractionHelper.safeDefer(interaction);

      if (!client.config.bot.commands.owners.includes(interaction.user.id) && !(interaction.memberPermissions?.has(PermissionFlagsBits.Administrator))) {
        return InteractionHelper.safeEditReply(interaction, { content: '❌ You must be an Administrator or Bot Owner.' });
      }

      await leaveAndStop(client, interaction.guildId);

      const embed = new EmbedBuilder()
        .setColor('#e67e22')
        .setDescription('👋 Left the voice channel and stopped the 24/7 connection.');
      await InteractionHelper.safeEditReply(interaction, { embeds: [embed] });

    } catch (error) {
      logger.error('Leave command error:', error);
      await InteractionHelper.safeEditReply(interaction, { content: 'An error occurred while leaving the voice channel.' });
    }
  },
};
