// inventory.js — View your owned shop items and active buffs

import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getBuffData } from '../../services/whiscy/inventoryService.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';
import { handleInteractionError } from '../../utils/errorHandler.js';
import { logger } from '../../utils/logger.js';

const BUFF_DISPLAY = {
  hunt_luck: { name: 'Hunt Luck Boost', emoji: '🍀' },
  battle_atk: { name: 'Battle ATK Boost', emoji: '⚔️' },
  xp_boost: { name: 'XP Boost', emoji: '💊' },
  whiscy_boost: { name: 'Whiscy Doubler', emoji: '🪙' },
};

export default {
  data: new SlashCommandBuilder()
    .setName('inventory')
    .setDescription('View your active buffs and items!')
    .setDMPermission(false),
  category: 'Economy',
  prefixSupport: true,

  async execute(interaction, config, client) {
    try {
      await InteractionHelper.safeDefer(interaction);

      const buffs = await getBuffData(client, interaction.guildId, interaction.user.id);
      const now = Date.now();

      const activeBuffs = [];

      for (const [buffType, buffData] of Object.entries(buffs)) {
        const display = BUFF_DISPLAY[buffType];
        if (!display) continue;

        // Check if buff is still active
        if (buffData.remaining > 0) {
          activeBuffs.push(`${display.emoji} **${display.name}** — ${buffData.remaining} use(s) left (value: +${buffData.value})`);
        } else if (buffData.expiresAt > now) {
          const remaining = buffData.expiresAt - now;
          const minutes = Math.ceil(remaining / 60000);
          activeBuffs.push(`${display.emoji} **${display.name}** — ${minutes}m remaining (value: x${buffData.value})`);
        }
      }

      const embed = new EmbedBuilder()
        .setColor('#3498db')
        .setTitle(`🎒 ${interaction.user.username}'s Inventory`)
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }));

      if (activeBuffs.length === 0) {
        embed.setDescription('No active buffs or items.\nVisit `/shop view` to buy some!');
      } else {
        embed.setDescription('**Active Buffs:**\n\n' + activeBuffs.join('\n'));
      }

      await InteractionHelper.safeEditReply(interaction, { embeds: [embed] });
    } catch (error) {
      logger.error('Inventory command error:', error);
      await handleInteractionError(interaction, error, { type: 'command', commandName: 'inventory' });
    }
  },
};