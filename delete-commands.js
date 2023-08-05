const { REST, Routes } = require("discord.js");
const { applicationId, guildId, token } = require("./config.json");

if (!token) {
    throw new Error("Missing token in config.json");
}
if (!applicationId) {
    throw new Error("Missing applicationId in config.json");
}

const rest = new REST().setToken(token);
(async () => {
    try {
        if (guildId) {
            console.log(`Started deleting all application (/) commands from guild ${guildId}.`);
            await rest.put(
                Routes.applicationGuildCommands(applicationId, guildId),
                {
                    body: []
                },
            );
            console.log(`Successfully deleted all application (/) commands from guild ${guildId}.`);
        } else {
            console.log("Started deleting all application (/) commands from all guilds.");
            await rest.put(
                Routes.applicationCommands(applicationId),
                {
                    body: []
                },
            );
            console.log("Successfully deleted all application (/) commands from all guilds.");
        }
    } catch (e) {
        console.error(e);
        console.log(`Failed to delete one or more application (/) commands${guildId ? ` from guild ${guildId}` : " from all guilds"}.`);
    }
})();
