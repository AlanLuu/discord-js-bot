const { SlashCommandBuilder } = require("discord.js");

const minimumDiceSides = 2;
const defaultDiceSides = 6;
module.exports = {
    data: new SlashCommandBuilder()
        .setName("roll")
        .setDescription("Roll a die.")
        .addIntegerOption(option =>
            option.setName("sides")
                .setDescription(`Number of sides on the die: minimum is ${minimumDiceSides}, default is ${defaultDiceSides}.`)),
    async execute(interaction) {
        const sides = interaction.options.getInteger("sides") ?? defaultDiceSides;
        if (sides < 2) {
            await interaction.reply(`${interaction.user}, you can't roll a die with less than ${minimumDiceSides} sides!`);
            return;
        }
        const roll = Math.floor(Math.random() * sides) + 1;
        await interaction.reply(`${interaction.user} rolls a D${sides} and gets **${roll}**.`);
    }
};
