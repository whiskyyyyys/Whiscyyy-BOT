export const commandAliases = {
  'bal': 'balance',
  'money': 'balance',
  'cash': 'balance',

  'daily': 'daily',
  'gamble': 'gamble',
  'bet': 'gamble',

  'help': 'help',
  'h': 'help',
  'info': 'help',

  'rank': 'rank',
  'lvl': 'rank',
  'xp': 'rank',
  'leaderboard': 'leaderboard',
  'lb': 'leaderboard',
  'top': 'leaderboard',

  'shop': 'shop',
  'buy': 'shop', // We map buy to shop because /shop buy <item> exists
  'inventory': 'inventory',
  'inv': 'inventory',
  'items': 'inventory',
  'buffs': 'inventory',
  
  'profile': 'profile',
  'me': 'profile',
  
  'admin': 'whiscyadmin',
  'setwhiscy': 'whiscyadmin',
};

export const subcommandAliases = {
  'buy': 'buy',
  'view': 'view',
  'coinflip': 'coinflip',
  'slots': 'slots',
};

export function resolveCommandAlias(commandName) {
  const normalized = commandName.toLowerCase();
  return commandAliases[normalized] || commandName;
}

export function resolveSubcommandAlias(subcommandName) {
  const normalized = subcommandName.toLowerCase();
  return subcommandAliases[normalized] || subcommandName;
}
