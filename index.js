const { Client, Events, GatewayIntentBits } = require("discord.js");
const { devIds: devIdArr, prefix, token } = require("./config.json");
const devIds = new Set(devIdArr); //Convert to a set for faster lookup times

const intents = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
];
if (prefix) intents.push(GatewayIntentBits.MessageContent);

const client = new Client({
    intents: intents
});

const commandErrorMsg = "There was an error while executing this command. " +
    "If this issue persists, please contact the bot developer.";

const replyWithoutPing = event => async options => {
    const optionsObject = {
        allowedMentions: {
            repliedUser: false
        }
    };
    if (typeof options === "string") {
        optionsObject.content = options;
    } else {
        Object.assign(optionsObject, options);
    }
    await event.reply(optionsObject);
};

client.once(Events.ClientReady, client => {
    const timestamp = new Date().toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "long"
    });
    console.log(`[${timestamp}] Logged in successfully as ${client.user.tag}`);
});

client.commands = require("./command-builder.js");

client.on(Events.MessageCreate, async message => {
    message.replyWithoutPing = replyWithoutPing(message);
    try {
        if (prefix && message.content.startsWith(prefix)) {
            const messageContent = message.content
                .slice(prefix.length)
                .trim();
            const args = messageContent.split(/ +/);
            const command = message.client.commands.get(args.shift().toLowerCase());
            if (command) {
                await command.execute(message, {
                    argsArr: args,
                    argsStr: args.join(" "),
                    prefix: prefix
                });
            }
        } else if (message.mentions.has(client.user) && devIds.has(message.author.id)) {
            const messageContent = message.content.toLowerCase();
            if (messageContent.includes("ping")) {
                await message.replyWithoutPing("Pong!");
            } else {
                await message.reply(`Hello ${message.author}`);
            }
        }
    } catch (e) {
        console.error(e);
        await message.replyWithoutPing(commandErrorMsg);
    }
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    interaction.replyWithoutPing = replyWithoutPing(interaction);
    try {
        await command.execute(interaction);
    } catch (e) {
        console.error(e);
        const errorNoticeOptions = {
            content: commandErrorMsg,
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
