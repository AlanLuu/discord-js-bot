const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    SlashCommandBuilder
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rps")
        .setDescription("Play a game of rock, paper, scissors!"),
    async execute(interaction, prefixCommandOptions) {
        const rpsPlayer = prefixCommandOptions ? interaction.author : interaction.user;

        const rock = new ButtonBuilder()
            .setCustomId("rock")
            .setLabel("Rock")
            .setStyle(ButtonStyle.Primary);
        const paper = new ButtonBuilder()
            .setCustomId("paper")
            .setLabel("Paper")
            .setStyle(ButtonStyle.Primary);
        const scissors = new ButtonBuilder()
            .setCustomId("scissors")
            .setLabel("Scissors")
            .setStyle(ButtonStyle.Primary);
        const row = new ActionRowBuilder()
            .addComponents(rock, paper, scissors);
        
        const response = await interaction.reply({
            content: `${rpsPlayer}, Choose your weapon!`,
            components: [row]
        });

        //Only allow the original interaction user to respond
        const isOriginalInteractionUser = i => i.user.id === rpsPlayer.id;

        const playRps = async (confirmation, playerChoice) => {
            const choices = ["rock", "paper", "scissors"];
            const computerChoice = choices[Math.floor(Math.random() * choices.length)];
            let replyStr = `You chose **${playerChoice}**! I chose **${computerChoice}**!\n`;
            if (playerChoice === computerChoice) {
                replyStr += "It's a tie!";
            } else {
                const winLose = {
                    rock: {
                        scissors: 1,
                        paper: 0
                    },
                    paper: {
                        rock: 1,
                        scissors: 0
                    },
                    scissors: {
                        paper: 1,
                        rock: 0
                    }
                };
                replyStr += `You ${winLose[playerChoice][computerChoice] ? "win" : "lose"}!`;
            }
            await confirmation.update({
                content: replyStr,
                components: []
            });
        };
        try {
            const confirmation = await response.awaitMessageComponent({
                filter: isOriginalInteractionUser,
                time: 15 * 1000
            });
            await playRps(confirmation, confirmation.customId);
        } catch (e) {
            try {
                await interaction.editReply({
                    content: "Sorry, you took too long to respond.",
                    components: []
                });
            } catch (e) {
                //If the original interaction has been deleted, we can't edit it
                await interaction.channel.send({
                    content: `Sorry ${rpsPlayer}, you took too long to respond to your rps command.`,
                    components: []
                });
            }
        }
    }
};
