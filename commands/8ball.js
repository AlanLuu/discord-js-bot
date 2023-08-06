const { SlashCommandBuilder } = require("discord.js");
const { random } = require("../util.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("8ball")
        .setDescription("Ask the magic 8-ball a question.")
        .addStringOption(option => 
            option.setName("question")
                .setDescription("The question to ask the magic 8-ball.")
                .setRequired(true)),
    async execute(interaction, { argsStr, prefix } = {}) {
        if (argsStr?.length === 0) {
            await interaction.replyWithoutPing(`Usage: ${prefix}8ball <question>`);
            return;
        }
        const responses = [
            "It is certain.",
            "It is decidedly so.",
            "Without a doubt.",
            "Yes - definitely.",
            "You may rely on it.",
            "As I see it, yes.",
            "Most likely.",
            "Outlook good.",
            "Signs point to yes.",
            "Yes.",
            "Reply hazy, try again.",
            "Ask again later.",
            "Better not tell you now...",
            "Cannot predict now.",
            "Concentrate and ask again.",
            "Don't count on it.",
            "My reply is no.",
            "My sources say no...",
            "Outlook not so good...",
            "Very doubtful.",
            "No.",
            "Absolutely not.",
            "Do not even think about it."
        ];
        const input = argsStr ?? interaction.options.getString("question");
        const response = random.choice(responses);
        await interaction.replyWithoutPing(`**Question:** ${input}\n**Answer:** ${response}`);
    }
};
