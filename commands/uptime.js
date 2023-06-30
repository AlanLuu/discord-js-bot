const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("uptime")
        .setDescription("Check the bot's uptime."),
    async execute(interaction) {
        //https://stackoverflow.com/a/49921759
        let totalSeconds = interaction.client.uptime / 1000;
        const days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        const hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);

        let uptimeStr = "Uptime: **";
        if (days > 0) uptimeStr += `${days} days, `;
        if (hours > 0) uptimeStr += `${hours} hours, `;
        if (minutes > 0) uptimeStr += `${minutes} minutes, `;
        uptimeStr += `${seconds} seconds**`;
        await interaction.reply(uptimeStr);
    }
};
