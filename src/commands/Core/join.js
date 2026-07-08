import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { joinAndMaintain } from '../../services/voice247Service.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';
import { logger } from '../../utils/logger.js';

export default {
  data: new SlashCommandBuilder()
    .setName('join')
    .setDescription('Makes the bot join your current voice channel and stay 24/7.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),
  category: 'Core',
  prefixSupport: true,

  async execute(interaction, config, client) {
    try {
      await InteractionHelper.safeDefer(interaction);

      // Pastikan command diakses lewat owner/admin
      if (!config.bot.commands.owners.includes(interaction.user.id) && !interaction.memberPermissions.has(PermissionFlagsBits.Administrator)) {
        return InteractionHelper.safeEditReply(interaction, { content: '❌ You must be an Administrator or Bot Owner.' });
      }

      // Cari VC tempat user berada
      const member = await interaction.guild.members.fetch(interaction.user.id);
      const voiceChannel = member.voice.channel;

      if (!voiceChannel) {
        const embed = new EmbedBuilder()
          .setColor('#e74c3c')
          .setDescription('❌ You need to be in a voice channel first!');
        return InteractionHelper.safeEditReply(interaction, { embeds: [embed] });
      }

      const success = await joinAndMaintain(client, interaction.guild, voiceChannel.id);

      if (success) {
        const embed = new EmbedBuilder()
          .setColor('#2ecc71')
          .setDescription(`✅ Joined ${voiceChannel.toString()} and will maintain a 24/7 connection!`);
        await InteractionHelper.safeEditReply(interaction, { embeds: [embed] });
      } else {
        const embed = new EmbedBuilder()
          .setColor('#e74c3c')
          .setDescription('❌ Failed to join the voice channel. Check my permissions.');
        await InteractionHelper.safeEditReply(interaction, { embeds: [embed] });
      }

    } catch (error) {
      logger.error('Join command error:', error);
      await InteractionHelper.safeEditReply(interaction, { content: 'An error occurred while joining the voice channel.' });
    }
  },
};
