const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("(Dev command) Replies with \"Pong!\" and the latency of the bot in milliseconds.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    isDevCommand: true,
    async execute(interaction) {
        const time = Date.now() - interaction.createdTimestamp;
        await interaction.replyWithoutPing(`Pong! (${time}ms)`);
    }
};
