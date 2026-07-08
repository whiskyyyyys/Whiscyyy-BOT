import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { getWhiscyData, setWhiscyData } from './inventoryService.js';
import { logger } from '../../utils/logger.js';

/**
 * Checks if a user is registered. If not, prompts them with a TOS.
 * @returns {boolean} true if registered and command should proceed, false if prompting (command should stop).
 */
export async function checkAndPromptRegistration(context, client, isInteraction = false) {
  const userId = isInteraction ? context.user.id : context.author.id;
  const guildId = context.guildId;

  const data = await getWhiscyData(client, guildId, userId);
  
  if (data.registered) {
    return true;
  }

  // Not registered, send prompt
  const embed = new EmbedBuilder()
    .setColor('#f1c40f')
    .setTitle('📜 Whiscy Bot Rules & Registration')
    .setDescription(
      `Welcome to Whiscy Bot, <@${userId}>!\n\n` +
      `Before you can start hunting, battling, and earning whiscy, you must agree to our rules:\n\n` +
      `**1.** No macroing or auto-typing.\n` +
      `**2.** No exploiting bugs or glitches.\n\n` +
      `By clicking **Accept**, you will receive a starting bonus of **25,000 whiscy 🪙**!`
    );

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('accept_rules')
      .setLabel('Accept')
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId('decline_rules')
      .setLabel('Decline')
      .setStyle(ButtonStyle.Danger)
  );

  let reply;
  try {
    if (isInteraction) {
      reply = await context.reply({ embeds: [embed], components: [row], fetchReply: true });
    } else {
      reply = await context.channel.send({ embeds: [embed], components: [row] });
    }
  } catch (err) {
    logger.error('Failed to send registration prompt:', err);
    return false;
  }

  // Create inline collector
  const collector = reply.createMessageComponentCollector({
    filter: (i) => i.user.id === userId,
    time: 60000,
    max: 1
  });

  collector.on('collect', async (i) => {
    if (i.customId === 'accept_rules') {
      // Give bonus
      data.registered = true;
      data.wallet = (data.wallet || 0) + 25000;
      await setWhiscyData(client, guildId, userId, data);
      
      const successEmbed = new EmbedBuilder()
        .setColor('#2ecc71')
        .setDescription(`✅ You have accepted the rules! **25,000 whiscy 🪙** has been added to your account.\n\nYou can now use commands like \`/hunt\`, \`/zoo\`, and \`/daily\`!`);
      
      await i.update({ embeds: [successEmbed], components: [] });
    } else {
      const declineEmbed = new EmbedBuilder()
        .setColor('#e74c3c')
        .setDescription(`❌ You declined the rules. You must accept them to play.`);
      await i.update({ embeds: [declineEmbed], components: [] });
    }
  });

  collector.on('end', (collected, reason) => {
    if (reason === 'time') {
      const timeoutEmbed = new EmbedBuilder()
        .setColor('#95a5a6')
        .setDescription('⏳ Registration timed out. Please run the command again.');
      
      reply.edit({ embeds: [timeoutEmbed], components: [] }).catch(() => {});
    }
  });

  return false;
}
