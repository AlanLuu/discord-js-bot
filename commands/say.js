const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("say")
        .setDescription("Replies with your input!")
        .addStringOption(option => 
            option.setName("input")
                .setDescription("The input to reply back with.")
                .setRequired(true)),
    async execute(interaction) {
        const input = interaction.options.getString("input");
        await interaction.reply(input);
    }
};
