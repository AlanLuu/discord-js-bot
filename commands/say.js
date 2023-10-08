const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("say")
        .setDescription("(Dev command) Replies with your input.")
        .addStringOption(option => option
            .setName("input")
            .setDescription("The input to reply back with.")
            .setRequired(true)
        ),
    isDevCommand: true,
    async execute(interaction, { argsStr, prefix } = {}) {
        if (argsStr?.length === 0) {
            await interaction.replyWithoutPing(`Usage: ${prefix}say <input>`);
            return;
        }
        const input = argsStr ?? interaction.options.getString("input");
        await interaction.replyWithoutPing(input);
    }
};
