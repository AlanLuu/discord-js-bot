const { REST, Routes } = require("discord.js");
const { applicationId, guildId, token } = require("./config.json");

if (!token) {
    throw new Error("Missing token in config.json");
}
if (!applicationId) {
    throw new Error("Missing applicationId in config.json");
}

const commandsCollection = require("./command-builder.js");
const commands = [];
for (const command of commandsCollection.values()) {
    if (!command.isDevCommand) {
        commands.push(command.data.toJSON());
    }
}

const rest = new REST().setToken(token);
(async () => {
    try {
        if (guildId) {
            console.log(`Started deploying ${commands.length} application (/) commands to guild ${guildId}.`);
            const data = await rest.put(
                Routes.applicationGuildCommands(applicationId, guildId),
                {
                    body: commands
                },
            );
            console.log(`Successfully deployed ${data.length} application (/) commands to guild ${guildId}.`);
        } else {
            console.log(`Started deploying ${commands.length} application (/) commands to all guilds.`);
            const data = await rest.put(
                Routes.applicationCommands(applicationId),
                {
                    body: commands
                },
            );
            console.log(`Successfully deployed ${data.length} application (/) commands. to all guilds.`);
        }
    } catch (e) {
        console.error(e);
        console.log(`Failed to deploy one or more application (/) commands${guildId ? ` to guild ${guildId}` : " to all guilds"}.`);
    }
})();
