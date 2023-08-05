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
- `guildId: string` ID of the guild to register the bot's slash commands in when the script to do so is ran. This can be left empty, in which case the bot's slash commands will be registered in all guilds the bot is in.
- `devGuildId: string` ID of the guild to register the bot's developer-specific slash commmands in. If left empty, the script to do so will refuse to register these commands.
- `prefix: string` Prefix for the bot's commands. By specifying this, the bot's commands can be invoked as prefix commands using the specified prefix as well as slash commands. This can be left empty, in which case the bot will only respond to commands as slash commands.

Register slash commands:
```
npm run deploy-commands
```

If you wish to utilize developer-specific slash commands, specify `devGuildId` in `config.json`, then run the following command to register them:
```
npm run deploy-commands-dev
```

Start the bot:
```
npm start
```
