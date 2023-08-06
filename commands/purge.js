const {
    CategoryChannel,
    PermissionFlagsBits,
    SlashCommandBuilder,
    StageChannel,
    VoiceChannel
} = require("discord.js");

const { bitwise: { orArray } } = require("../util.js");
const perms = [
    PermissionFlagsBits.ManageMessages,
    PermissionFlagsBits.BanMembers
];
module.exports = {
    data: new SlashCommandBuilder()
        .setName("purge")
        .setDescription("Purge all messages less than 14 days old from a user in a channel.")
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
        .setDefaultMemberPermissions(orArray(perms)),
    perms,
    async purgeMessages(user, channel) {
        const messages = await channel.messages.fetch();
        const messagesToDelete = messages
            .filter(message => message.author.id === user.id);
        if (messagesToDelete.size !== 0) {
            //Discord only allows bulk deleting messages that are less than 14 days old
            const deletedMsgs = await channel.bulkDelete(messagesToDelete, true);
            return deletedMsgs.size;
        }
        return 0;
    },
    async execute(interaction, { argsArr, prefix } = {}) {
        if (argsArr && !perms.every(perm => interaction.member.permissions.has(perm))) {
            return;
        }

        if (argsArr?.length === 0) {
            await interaction.replyWithoutPing(`Usage: ${prefix}purge <user> [channel]`);
            return;
        }

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages)) {
            await interaction.replyWithoutPing(`:x: I am missing the "**Manage Messages**" permission on this server. Please grant me this permission and try again.`);
            return;
        }

        let purgeUser;
        let purgeChannel;
        if (argsArr) {
            try {
                purgeUser = await interaction.guild.members.fetch(argsArr[0].replace(/<@!?(\d+)>/, "$1"));
            } catch (e) {
                await interaction.replyWithoutPing(`:x: User ${argsArr[0]} not found.`);
                return;
            }
            const channelID = argsArr[1]?.replace(/<#(\d+)>/, "$1");
            if (channelID) {
                purgeChannel = interaction.client.channels.cache.get(channelID);
                if (!purgeChannel) {
                    await interaction.replyWithoutPing(`:x: Channel ${channelID} not found.`);
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
            await interaction.replyWithoutPing(`:x: The channel ${purgeChannel} is not a text channel.`);
            return;
        }
        if (!purgeChannel.permissionsFor(interaction.client.user).has(PermissionFlagsBits.ViewChannel)) {
            await interaction.replyWithoutPing(":x: I do not have permission to view the channel you specified.");
            return;
        }
        
        const numMessagesPurged = await this.purgeMessages(purgeUser, purgeChannel);
        const response = numMessagesPurged === 0
            ? `:x: Failed to purge messages from ${purgeUser} in ${purgeChannel}. This could be because the user has no messages in the specified channel, or all messages from the user in the channel are older than 14 days.`
            : `:white_check_mark: Successfully purged **${numMessagesPurged}** message${numMessagesPurged > 1 ? "s" : ""} from ${purgeUser} in ${purgeChannel}.`;
        if (argsArr) {
            await interaction.channel.send(response);
        } else {
            await interaction.reply(response);
        }
    }
};
