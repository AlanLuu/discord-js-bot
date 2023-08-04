const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("say")
        .setDescription("Replies with your input.")
        .addStringOption(option => 
            option.setName("input")
                .setDescription("The input to reply back with.")
                .setRequired(true)),
    async execute(interaction, { argsStr, prefix } = {}) {
        if (argsStr?.length === 0) {
            await interaction.replyWithoutPing({
                content: `Usage: ${prefix}say <input>`,
                ephemeral: true
            });
            return;
        }
        const input = argsStr ?? interaction.options.getString("input");
        await interaction.replyWithoutPing(input);
    }
};
