const { Client, Events, GatewayIntentBits } = require("discord.js");
const { token } = require("./config.json");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ]
});

client.once(Events.ClientReady, client => {
    console.log(`Logged in successfully as ${client.user.tag}`);
});

client.commands = require("./command-builder.js");

client.on(Events.MessageCreate, async message => {
    if (message.mentions.has(client.user)) {
        await message.reply(`Hello ${message.author}!`);
    }
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
		return;
    }

    try {
        await command.execute(interaction);
    } catch (e) {
        console.error(e);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: "There was an error while executing this command!",
                ephemeral: true
            });
        } else {
            await interaction.reply({
                content: "There was an error while executing this command!",
                ephemeral: true
            });
        }
    }
});

client.login(token);