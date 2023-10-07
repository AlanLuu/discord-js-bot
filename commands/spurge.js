const {
    CategoryChannel,
    PermissionFlagsBits,
    SlashCommandBuilder,
    StageChannel,
    VoiceChannel
} = require("discord.js");

const { perms: permsArr, purgeMessages } = require("./purge.js");
const { bitwise: { orArray }, perms } = require("../util.js");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("spurge")
        .setDescription("Same as purge, but do not display a visible reply on success.")
        .addUserOption(option => option
            .setName("user")
            .setDescription("The user to purge messages from")
            .setRequired(true)
        )
        .addChannelOption(option => option
            .setName("channel")
            .setDescription("The channel to purge messages from, purges from the current channel if not specified")
            .setRequired(false)
        )
        .setDefaultMemberPermissions(orArray(permsArr)),
    async execute(interaction, { argsArr, prefix } = {}) {
        const spurgeReply = async content => {
            await interaction.replyWithoutPing({
                content,
                ephemeral: true,
            });
        };

        if (argsArr && !perms.hasAll(interaction.member, permsArr)) {
            return;
        }

        if (argsArr?.length === 0) {
            await spurgeReply(`Usage: ${prefix}purge <user> [channel]`);
            return;
        }

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages)) {
            await spurgeReply(`:x: I am missing the "**Manage Messages**" permission on this server. Please grant me this permission and try again.`);
            return;
        }

        let purgeUser;
        let purgeChannel;
        if (argsArr) {
            try {
                purgeUser = await interaction.guild.members.fetch(argsArr[0].replace(/<@!?(\d+)>/, "$1"));
            } catch (e) {
                await spurgeReply(`:x: User ${argsArr[0]} not found.`);
                return;
            }
            const channelID = argsArr[1]?.replace(/<#(\d+)>/, "$1");
            if (channelID) {
                purgeChannel = interaction.client.channels.cache.get(channelID);
                if (!purgeChannel) {
                    await spurgeReply(`:x: Channel ${channelID} not found.`);
                    return;
                }
            } else {
                purgeChannel = interaction.channel;
            }
        } else {
            purgeUser = interaction.options.getUser("user");
            purgeChannel = interaction.options.getChannel("channel") ?? interaction.channel;
        }

        if (
            purgeChannel instanceof VoiceChannel ||
            purgeChannel instanceof StageChannel ||
            purgeChannel instanceof CategoryChannel
        ) {
            await spurgeReply(`:x: The channel ${purgeChannel} is not a text channel.`);
            return;
        }
        if (!purgeChannel.permissionsFor(interaction.client.user).has(PermissionFlagsBits.ViewChannel)) {
            await spurgeReply(":x: I do not have permission to view the channel you specified.");
            return;
        }
        
        const numMessagesPurged = await purgeMessages(purgeUser, purgeChannel);
        const response = numMessagesPurged === 0
            ? `:x: Failed to purge messages from ${purgeUser} in ${purgeChannel}. This could be because the user has no messages in the specified channel, or all messages from the user in the channel are older than 14 days.`
            : `:white_check_mark: Successfully purged **${numMessagesPurged}** message${numMessagesPurged > 1 ? "s" : ""} from ${purgeUser} in ${purgeChannel}.`;
        if (!argsArr) {
            await spurgeReply(response);
        }
    }
};
