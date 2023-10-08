const { Client, Events, GatewayIntentBits } = require("discord.js");
const { timestamp } = require("./util.js");
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
    timestamp.log(`Logged in successfully as ${client.user.tag}`);
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
            const commandName = args.shift().toLowerCase();
            const command = message.client.commands.get(commandName);
            const isDevCommand = command?.isDevCommand;
            if (command && (!isDevCommand || devIds.has(message.author.id))) {
                await command.execute(message, {
                    argsArr: args,
                    argsStr: args.join(" "),
                    prefix: prefix
                });
            } else if (!isDevCommand) {
                timestamp.error(`No command matching ${commandName} was found.`);
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
        timestamp.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    interaction.replyWithoutPing = replyWithoutPing(interaction);
    if (command.isDevCommand && !devIds.has(interaction.user.id)) {
        await interaction.replyWithoutPing({
            content: ":x: You are not allowed to use this command.",
            ephemeral: true
        });
        return;
    }
    
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
