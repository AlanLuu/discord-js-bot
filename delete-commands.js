const { REST, Routes } = require("discord.js");
const { clientId, guildId, token } = require("./config.json");

const rest = new REST().setToken(token);
(async () => {
    try {
        console.log("Started deleting all application (/) commands.");
        await rest.put(
            (guildId ? Routes.applicationGuildCommands(clientId, guildId)
                : Routes.applicationCommands(clientId)),
            {
                body: []
            },
        );
        console.log("Successfully deleted all application (/) commands.");
    } catch (e) {
        console.error(e);
        console.log("Failed to delete one or more application (/) commands.");
    }
})();