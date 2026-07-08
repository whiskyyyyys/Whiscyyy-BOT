// help.js — Show all available commands

import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';
import { handleInteractionError } from '../../utils/errorHandler.js';
import { logger } from '../../utils/logger.js';

export default {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show all available commands!')
    .setDMPermission(false),
  category: 'Core',
  prefixSupport: true,

  async execute(interaction, config, client) {
    try {
      await InteractionHelper.safeDefer(interaction);

      const prefix = config?.prefix || '!';

      const embed = new EmbedBuilder()
        .setColor('#9b59b6')
        .setTitle('🐾 Whiscy Bot — Commands')
        .setDescription(
          `Use \`/command\` or \`${prefix}command\` to run commands!\n\n` +
          `**🌿 Hunting & Collection**\n` +
          `> \`/hunt\` — Hunt for wild animals\n` +
          `> \`/zoo\` — View your animal collection\n` +
          `> \`/battle\` — Battle monsters with your animals\n\n` +
          `**💰 Economy**\n` +
          `> \`/daily\` — Claim daily whiscy reward\n` +
          `> \`/balance\` — Check your whiscy balance\n` +
          `> \`/gamble coinflip <amount>\` — Flip a coin\n` +
          `> \`/gamble slots <amount>\` — Spin the slots\n\n` +
          `**🛒 Shop & Items**\n` +
          `> \`/shop view\` — Browse the shop\n` +
          `> \`/shop buy <item>\` — Buy an item\n` +
          `> \`/inventory\` — View active buffs\n\n` +
          `**📊 Stats & Ranking**\n` +
          `> \`/profile\` — View your full profile\n` +
          `> \`/rank\` — Check your level & XP\n` +
          `> \`/leaderboard\` — View the leaderboard\n\n` +
          `**🔧 Admin (Leveling)**\n` +
          `> \`/level\` — Configure leveling system\n` +
          `> \`/leveladd\` — Add levels to a user\n` +
          `> \`/levelremove\` — Remove levels from a user\n` +
          `> \`/levelset\` — Set a user's level`
        )
        .setFooter({ text: 'Whiscy Bot • Catch animals, battle monsters, earn whiscy! 🪙' })
        .setTimestamp();

      await InteractionHelper.safeEditReply(interaction, { embeds: [embed] });
    } catch (error) {
      logger.error('Help command error:', error);
      await handleInteractionError(interaction, error, { type: 'command', commandName: 'help' });
    }
  },
};
