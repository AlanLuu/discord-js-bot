const { REST, Routes } = require("discord.js");
const { clientId, guildId, token } = require("./config.json");

const rest = new REST().setToken(token);
(async () => {
    try {
        if (guildId) {
            console.log(`Started deleting all application (/) commands from guild ${guildId}.`);
            await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                {
                    body: []
                },
            );
            console.log(`Successfully deleted all application (/) commands from guild ${guildId}.`);
        } else {
            console.log("Started deleting all application (/) commands.");
            await rest.put(
                Routes.applicationCommands(clientId),
                {
                    body: []
                },
            );
            console.log("Successfully deleted all application (/) commands.");
        }
    } catch (e) {
        console.error(e);
        console.log(`Failed to delete one or more application (/) commands${guildId ? ` from guild ${guildId}` : ""}.`);
    }
})();
