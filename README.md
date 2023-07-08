# discord-js-bot
A discord bot written in JavaScript using the discord.js library

# Setup
(Requires [Node.js](https://nodejs.org/en) v18.x or later)

Clone the repository and install dependencies:
```
git clone https://github.com/AlanLuu/discord-js-bot.git
cd discord-js-bot
npm i
```

Copy `config-example.json` to `config.json` and fill in the values in `config.json`:
```
cp config-example.json config.json
```

`config.json` values:
- `token: string` Bot token
- `applicationId: string` Bot application ID, necessary for registering the bot's slash commands.
- `devIds: string[]` Array of user IDs that are considered to be developers; only these users will be able to use any bot commands/features that are meant for developers only. This array can be left empty, in which case no user will be able to use any developer-specific commands/features.
- `guildId: string` ID of the guild to register the bot's slash commands in when the command to do so is ran. This can be left empty, in which case the bot's slash commands will be registered in all guilds the bot is in.

Register slash commands:
```
npm run deploy-commands
```

Start the bot:
```
npm start
```
