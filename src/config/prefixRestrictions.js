export const SLASH_ONLY_COMMANDS = new Set([
  'help', // Keeping help slash only is fine, or we can allow it. We allowed it in help.js (prefixSupport: true)
]);

export function getPrefixRestriction(command, args, resolveSubcommandAlias) {
  if (!command?.data?.toJSON) {
    return { blocked: false };
  }

  const commandJson = command.data.toJSON();
  const commandName = commandJson.name?.toLowerCase();

  if (command.prefixOnly === false || command.slashOnly === true) {
    return { blocked: true, reason: 'This command is only available as a slash command.' };
  }

  return { blocked: false };
}

export function isPrefixRestrictedCommand(command, args, resolveSubcommandAlias) {
  return getPrefixRestriction(command, args, resolveSubcommandAlias).blocked;
}
