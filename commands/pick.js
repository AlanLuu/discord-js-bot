const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pick")
        .setDescription("Pick a random item from a list containing 2 or more elements.")
        .addStringOption(option =>
            option.setName("list")
                .setDescription("A comma-separated list of items to choose from.")
                .setRequired(true)),
    async execute(interaction, { argsStr, prefix } = {}) {
        if (argsStr?.length === 0) {
            await interaction.replyWithoutPing(`Usage: ${prefix}pick <item1>, <item2>, ...`);
            return;
        }
        const list = (argsStr ?? interaction.options.getString("list"))
            .split(",")
            .map(item => item.trim());
        if (list.length <= 1) {
            await interaction.replyWithoutPing({
                content: `You only gave me one item to choose from.`,
                ephemeral: true
            });
            return;
        }
        const pick = list[Math.floor(Math.random() * list.length)];
        const listStr = list.join(", ");
        if (argsStr) {
            await interaction.replyWithoutPing(`I randomly picked: **${pick}**`);
        } else {
            await interaction.replyWithoutPing(`Choices: **[${listStr}]**\nI randomly picked: **${pick}**`);
        }
    }
};
