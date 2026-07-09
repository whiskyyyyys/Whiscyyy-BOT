# Whiscy - Pure 24/7 Voice Bot

**Whiscy** is a specialized, lightweight Discord bot designed for one single purpose: maintaining a 24/7 connection in your server's voice channels. It has been completely stripped of all unnecessary bloat (economy, leveling, music players, etc.) to ensure maximum stability and zero downtime for your voice sessions.

[![Discord.js](https://img.shields.io/npm/v/discord.js?style=flat-square&labelColor=%23202225&color=%23202225&logo=npm&logoColor=white&logoWidth=20)](https://www.npmjs.com/package/discord.js)
![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-%23336791?logo=postgresql&logoColor=white&style=flat-square&logoWidth=20)

## 🌟 Key Features

- **Pure 24/7 Voice Presence**: Joins your voice channel and stays there indefinitely.
- **Anti-AFK Protection**: Bypasses Discord's idle timeout by silently broadcasting an invisible, zero-volume audio stream, guaranteeing the bot never gets kicked for being inactive.
- **Instant Auto-Reconnect**: If a network disruption occurs, the bot reconnects in under 1 second.
- **Persistent Memory**: Remembers which voice channel it was in. If the bot restarts or redeploys on your host, it automatically rejoins the last saved channel.

## 🤖 Commands

The bot is kept incredibly simple with only two core commands:

- `/join` (or `w!join`) - Makes the bot join your current voice channel and activates the 24/7 maintainer protocol.
- `/leave` (or `w!leave`) - Stops the maintainer and makes the bot gracefully leave the channel.

## 🚀 Deployment (Railway / Cloud)

This bot is highly optimized for instant deployment on cloud platforms like **Railway**. It does not require complex setup or heavy dependencies like Lavalink or FFmpeg anymore.

### Required Environment Variables (.env)

```env
DISCORD_TOKEN=your_discord_bot_token_here
CLIENT_ID=your_discord_client_id_here

# PostgreSQL is REQUIRED for the bot to remember voice channels after a restart!
POSTGRES_URL=postgresql://user:pass@host:port/dbname
```

## 🔒 Required Bot Intents & Permissions

### Intents
- **Guilds**
- **Guild Voice States**
- **Message Content**

### Permissions
- **View Channels**
- **Connect** (To join the voice channel)
- **Speak** (Required to transmit the silent audio stream and bypass Discord's AFK system)

---

## License

Released under the MIT License.
