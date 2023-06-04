const fs = require("node:fs");
const path = require("node:path");
const { Collection } = require("discord.js");

const commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFileNames = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));
for (const fileName of commandFileNames) {
    const fullFilePath = path.join(commandsPath, fileName);
    const command = require(fullFilePath);
    if ("data" in command && "execute" in command) {
        commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

module.exports = commands;