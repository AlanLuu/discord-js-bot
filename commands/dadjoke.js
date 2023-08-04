const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("dadjoke")
        .setDescription("Get a random dad joke."),
    async execute(interaction) {
        const abort = async debugInfo => {
            console.log(debugInfo);
            await interaction.replyWithoutPing("Sorry, I couldn't get a dad joke. :(");
        };

        const apiURL = "https://icanhazdadjoke.com/";
        const response = await fetch(apiURL, {
            headers: {
                Accept: "application/json"
            }
        });
        if (response.status !== 200) {
            await abort(response);
            return;
        }

        const json = await response.json();
        if (json.status !== 200) {
            await abort(json);
            return;
        }

        await interaction.replyWithoutPing(json.joke);
    }
};
