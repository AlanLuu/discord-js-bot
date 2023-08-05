const { REST, Routes } = require("discord.js");
const { applicationId, devGuildId, token } = require("./config.json");

if (!devGuildId) {
    throw new Error("Missing devGuildId in config.json");
}
if (!token) {
    throw new Error("Missing token in config.json");
}
if (!applicationId) {
    throw new Error("Missing applicationId in config.json");
}

const commandsCollection = require("./command-builder.js");
const commands = [];
for (const command of commandsCollection.values()) {
    if (command.isDevCommand) {
        commands.push(command.data.toJSON());
    }
}

const rest = new REST().setToken(token);
(async () => {
    try {
        console.log(`Started deploying ${commands.length} dev application (/) commands to guild ${devGuildId}.`);
        const data = await rest.put(
            Routes.applicationGuildCommands(applicationId, devGuildId),
            {
                body: commands
            },
        );
        console.log(`Successfully deployed ${data.length} dev application (/) commands to guild ${devGuildId}.`);
    } catch (e) {
        console.error(e);
        console.log(`Failed to deploy one or more dev application (/) commands to guild ${devGuildId}.`);
    }
})();
