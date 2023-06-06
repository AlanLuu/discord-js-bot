const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pick")
        .setDescription("Pick a random item from a list containing 2 or more elements.")
        .addStringOption(option =>
            option.setName("list")
                .setDescription("A comma-separated list of items to choose from.")
                .setRequired(true)),
    async execute(interaction) {
        const list = interaction.options.getString("list")
            .split(",")
            .map(item => item.trim());
        if (list.length <= 1) {
            await interaction.reply(`${interaction.user}, you only gave me one item to choose from!`);
            return;
        }
        const pick = list[Math.floor(Math.random() * list.length)];
        const listStr = list.join(", ");
        await interaction.reply(`${interaction.user}'s choices: **[${listStr}]**\nI randomly picked: **${pick}**`);
    }
};