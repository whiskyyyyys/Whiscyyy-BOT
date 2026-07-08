// shop.js — Browse and buy items from the whiscy shop

import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getShopItemsList, purchaseItem } from '../../services/whiscy/shopService.js';
import { getWhiscyData, formatWhiscy } from '../../services/whiscy/inventoryService.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';
import { handleInteractionError } from '../../utils/errorHandler.js';
import { logger } from '../../utils/logger.js';

export default {
  data: new SlashCommandBuilder()
    .setName('shop')
    .setDescription('Browse or buy items from the Whiscy Shop!')
    .addSubcommand(sub =>
      sub.setName('view').setDescription('Browse available items')
    )
    .addSubcommand(sub =>
      sub
        .setName('buy')
        .setDescription('Buy an item')
        .addStringOption(opt =>
          opt
            .setName('item')
            .setDescription('Item to buy')
            .setRequired(true)
            .addChoices(
              { name: '🎣 Hunting Lure (500)', value: 'hunting_lure' },
              { name: '⚔️ Battle Charm (800)', value: 'battle_charm' },
              { name: '🍀 Lucky Clover (1,000)', value: 'lucky_clover' },
              { name: '💊 XP Boost (1,500)', value: 'xp_boost' },
              { name: '🎁 Mystery Box (2,000)', value: 'mystery_box' },
              { name: '🪙 Whiscy Doubler (5,000)', value: 'whiscy_doubler' },
            )
        )
    )
    .setDMPermission(false),
  category: 'Economy',
  prefixSupport: true,

  async execute(interaction, config, client) {
    try {
      await InteractionHelper.safeDefer(interaction);

      const subcommand = interaction.options.getSubcommand();

      if (subcommand === 'view') {
        await handleShopView(interaction, client);
      } else if (subcommand === 'buy') {
        await handleShopBuy(interaction, client);
      }
    } catch (error) {
      logger.error('Shop command error:', error);
      await handleInteractionError(interaction, error, { type: 'command', commandName: 'shop' });
    }
  },
};

async function handleShopView(interaction, client) {
  const items = getShopItemsList();
  const data = await getWhiscyData(client, interaction.guildId, interaction.user.id);

  let description = '';
  for (const item of items) {
    const canAfford = (data.wallet || 0) >= item.price;
    const priceStr = item.price.toLocaleString();
    description += `${item.emoji} **${item.name}** — ${priceStr} whiscy 🪙${canAfford ? '' : ' *(not enough)*'}\n`;
    description += `> ${item.description}\n\n`;
  }

  const embed = new EmbedBuilder()
    .setColor('#f1c40f')
    .setTitle('🛒 Whiscy Shop')
    .setDescription(description.trim())
    .setFooter({ text: `Your balance: ${formatWhiscy(data.wallet || 0)} | Use /shop buy <item>` });

  await InteractionHelper.safeEditReply(interaction, { embeds: [embed] });
}

async function handleShopBuy(interaction, client) {
  const itemId = interaction.options.getString('item');
  const result = await purchaseItem(client, interaction.guildId, interaction.user.id, itemId);

  if (!result.success) {
    const embed = new EmbedBuilder()
      .setColor('#e74c3c')
      .setDescription(`❌ ${result.message}`);
    await InteractionHelper.safeEditReply(interaction, { embeds: [embed] });
    return;
  }

  const embed = new EmbedBuilder()
    .setColor('#2ecc71')
    .setTitle('✅ Purchase Successful!')
    .setDescription(
      `${result.message}\n\n` +
      `Balance: **${formatWhiscy(result.newBalance)}**`
    );

  if (result.animal) {
    embed.addFields({
      name: 'Animal Received',
      value: `${result.animal.emoji} ${result.animal.name} (${result.animal.rarity})`,
    });
  }

  await InteractionHelper.safeEditReply(interaction, { embeds: [embed] });
}
