import { Events } from "discord.js";
import { logger, startupLog } from "../utils/logger.js";
import config from "../config/application.js";
import { reconnectAllSavedVoices } from "../services/voice247Service.js";

export default {
  name: Events.ClientReady,
  once: true,

  async execute(client) {
    try {
      client.user.setPresence(config.bot.presence);

      startupLog(`Ready! Logged in as ${client.user.tag}`);
      startupLog(`Serving ${client.guilds.cache.size} guild(s)`);
      startupLog(`Loaded ${client.commands.size} commands`);

      // Attempt to auto-rejoin any 24/7 voice channels
      await reconnectAllSavedVoices(client);
    } catch (error) {
      logger.error("Error in ready event:", error);
    }
  },
};