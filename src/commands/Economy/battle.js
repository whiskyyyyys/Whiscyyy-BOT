// battle.js — PvE battle command using collected animals

import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { performBattle } from '../../services/whiscy/battleService.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';
import { handleInteractionError } from '../../utils/errorHandler.js';
import { logger } from '../../utils/logger.js';

export default {
  data: new SlashCommandBuilder()
    .setName('battle')
    .setDescription('Battle a wild monster with your strongest animal!')
    .setDMPermission(false),
  category: 'Economy',
  prefixSupport: true,

  async execute(interaction, config, client) {
    try {
      await InteractionHelper.safeDefer(interaction);

      const result = await performBattle(client, interaction.guildId, interaction.user.id);

      if (!result.success) {
        if (result.reason === 'cooldown') {
          const embed = new EmbedBuilder()
            .setColor('#e74c3c')
            .setDescription(`⏳ Your animal is resting! Wait **${result.formatted}**.`);
          await InteractionHelper.safeEditReply(interaction, { embeds: [embed] });
          return;
        }

        const embed = new EmbedBuilder()
          .setColor('#e74c3c')
          .setDescription(`❌ ${result.message}`);
        await InteractionHelper.safeEditReply(interaction, { embeds: [embed] });
        return;
      }

      const { won, animal, monster, animalAtk, whiscyReward, newBalance, hadAtkBuff } = result;

      const embed = new EmbedBuilder()
        .setColor(result.rarityColor)
        .setTitle('⚔️ Battle!')
        .setDescription(
          `**Your Fighter:** ${animal.emoji} ${animal.name} (ATK: ${animalAtk}${hadAtkBuff ? ' *+buff*' : ''})\n` +
          `**VS**\n` +
          `**Monster:** ${monster.emoji} ${monster.name} Lv.${monster.level} (ATK: ${monster.atk})\n\n` +
          (won
            ? `✅ **You won!** +**${whiscyReward}** whiscy 🪙`
            : `❌ **You lost!** Better luck next time.`)
        )
        .setFooter({ text: `Balance: ${(newBalance || 0).toLocaleString()} whiscy 🪙` });

      await InteractionHelper.safeEditReply(interaction, { embeds: [embed] });
    } catch (error) {
      logger.error('Battle command error:', error);
      await handleInteractionError(interaction, error, { type: 'command', commandName: 'battle' });
    }
  },
};
