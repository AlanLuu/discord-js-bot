const { Client, Events, GatewayIntentBits } = require("discord.js");
const { devIds: devIdArr, token } = require("./config.json");
const devIds = new Set(devIdArr); //Convert to a set for faster lookup times

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ]
});

client.once(Events.ClientReady, client => {
    const timestamp = new Date().toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "long"
    });
    console.log(`[${timestamp}] Logged in successfully as ${client.user.tag}`);
});

client.commands = require("./command-builder.js");

client.on(Events.MessageCreate, async message => {
    try {
        if (message.mentions.has(client.user) && devIds.has(message.author.id)) {
            const messageContent = message.content.toLowerCase();
            if (messageContent.includes("ping")) {
                await message.reply({
                    content: "Pong!",
                    allowedMentions: {
                        repliedUser: false
                    }
                });
            } else {
                await message.reply(`Hello ${message.author}`);
            }
        }
    } catch (e) {
        console.error(e);
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
        const errorNoticeOptions = {
            content: "There was an error while executing this command. If this issue persists, please contact the bot developer.",
            ephemeral: true
        };
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(errorNoticeOptions);
        } else {
            await interaction.reply(errorNoticeOptions);
        }
    }
});

client.login(token);
