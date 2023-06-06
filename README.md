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
- `token`: Bot token
- `clientId`: Bot client ID, used to register slash commands
- `guildId` (optional): ID of the guild to register slash commands in; if omitted, the bot will register slash commands globally

Register slash commands:
```
npm run deploy-commands
```

Start the bot:
```
npm start
```