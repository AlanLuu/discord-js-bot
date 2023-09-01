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

const rest = new REST().setToken(token);
(async () => {
    try {
        console.log(`Started deleting all dev application (/) commands from guild ${devGuildId}.`);
        await rest.put(
            Routes.applicationGuildCommands(applicationId, devGuildId),
            {
                body: []
            },
        );
        console.log(`Successfully deleted all dev application (/) commands from guild ${devGuildId}.`);
    } catch (e) {
        console.error(e);
        console.log(`Failed to delete one or more dev application (/) commands from guild ${devGuildId}.`);
    }
})();
