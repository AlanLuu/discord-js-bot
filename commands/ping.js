const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with \"Pong!\" and the latency of the bot in milliseconds."),
    async execute(interaction) {
        const time = Date.now() - interaction.createdTimestamp;
        await interaction.replyWithoutPing(`Pong! (${time}ms)`);
    }
};
