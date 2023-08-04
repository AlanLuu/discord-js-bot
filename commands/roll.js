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
    async execute(interaction, { argsArr } = {}) {
        let sides;
        if (argsArr) {
            if (argsArr.length > 0) {
                sides = Number(argsArr[0]);
                if (!Number.isInteger(sides)) {
                    await interaction.replyWithoutPing(`"${argsArr[0]}" is not a valid integer.`);
                    return;
                }
            } else {
                sides = defaultDiceSides;
            }
        } else {
            sides = interaction.options.getInteger("sides") ?? defaultDiceSides;
        }
        if (sides < minimumDiceSides) {
            await interaction.replyWithoutPing(`You can't roll a die with less than ${minimumDiceSides} sides.`);
            return;
        }
        const roll = Math.floor(Math.random() * sides) + 1;
        await interaction.replyWithoutPing(`Rolled a D${sides} and got **${roll}**.`);
    }
};
