// hunt.js — Hunt command: catch random animals and earn whiscy

import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { performHunt } from '../../services/whiscy/huntService.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';
import { handleInteractionError } from '../../utils/errorHandler.js';
import { logger } from '../../utils/logger.js';

export default {
  data: new SlashCommandBuilder()
    .setName('hunt')
    .setDescription('Go hunting for wild animals!')
    .setDMPermission(false),
  category: 'Economy',
  prefixSupport: true,

  async execute(interaction, config, client) {
    try {
      await InteractionHelper.safeDefer(interaction);

      const result = await performHunt(client, interaction.guildId, interaction.user.id);

      if (!result.success && result.reason === 'cooldown') {
        const embed = new EmbedBuilder()
          .setColor('#e74c3c')
          .setDescription(`⏳ You're still tired from your last hunt! Wait **${result.formatted}**.`);
        await InteractionHelper.safeEditReply(interaction, { embeds: [embed] });
        return;
      }

      if (result.success && !result.found) {
        const embed = new EmbedBuilder()
          .setColor('#95a5a6')
          .setTitle('🌿 Hunting...')
          .setDescription('You searched around but found nothing this time. Try again!')
          .setFooter({ text: 'Better luck next time!' });
        await InteractionHelper.safeEditReply(interaction, { embeds: [embed] });
        return;
      }

      const { animal, whiscyEarned, rarityColor, hadLuckBuff, newBalance } = result;

      const embed = new EmbedBuilder()
        .setColor(rarityColor)
        .setTitle('🌿 Hunting...')
        .setDescription(
          `You caught a **${animal.emoji} ${animal.name}**! (${result.rarityEmoji} ${animal.rarity})\n\n` +
          `+**${whiscyEarned}** whiscy 🪙${hadLuckBuff ? ' *(🍀 luck boost active)*' : ''}`
        )
        .setFooter({ text: `Balance: ${newBalance.toLocaleString()} whiscy 🪙` });

      await InteractionHelper.safeEditReply(interaction, { embeds: [embed] });
    } catch (error) {
      logger.error('Hunt command error:', error);
      await handleInteractionError(interaction, error, { type: 'command', commandName: 'hunt' });
    }
  },
};
