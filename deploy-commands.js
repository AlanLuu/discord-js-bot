const { REST, Routes } = require("discord.js");
const { clientId, guildId, token } = require("./config.json");

const commandsCollection = require("./command-builder.js");
const commands = [];
for (const command of commandsCollection.values()) {
    commands.push(command.data.toJSON());
}

const rest = new REST().setToken(token);
(async () => {
    try {
        if (guildId) {
            console.log(`Started deploying ${commands.length} application (/) commands to guild ${guildId}.`);
            const data = await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                {
                    body: commands
                },
            );
            console.log(`Successfully deployed ${data.length} application (/) commands to guild ${guildId}.`);
        } else {
            console.log(`Started deploying ${commands.length} application (/) commands.`);
            const data = await rest.put(
                Routes.applicationCommands(clientId),
                {
                    body: commands
                },
            );
            console.log(`Successfully deployed ${data.length} application (/) commands.`);
        }
    } catch (e) {
        console.error(e);
        console.log(`Failed to deploy one or more application (/) commands${guildId ? ` to guild ${guildId}` : ""}.`);
    }
})();