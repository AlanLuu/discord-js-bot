const {
    CategoryChannel,
    PermissionFlagsBits,
    SlashCommandBuilder,
    StageChannel,
    VoiceChannel
} = require("discord.js");

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
        .setDefaultMemberPermissions(
            PermissionFlagsBits.ManageMessages |
            PermissionFlagsBits.BanMembers
        ),
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
    async execute(interaction) {
        if (!interaction.appPermissions.has(PermissionFlagsBits.ManageMessages)) {
            await interaction.reply(`:x: I am missing the "**Manage Messages**" permission on this server. Please grant me this permission and try again.`);
            return;
        }
        const purgeUser = interaction.options.getUser("user");
        const purgeChannel = interaction.options.getChannel("channel") ?? interaction.channel;
        if (!purgeChannel.permissionsFor(interaction.client.user).has(PermissionFlagsBits.ViewChannel)) {
            await interaction.reply(":x: I do not have permission to view the channel you specified.");
            return;
        }
        if (
            purgeChannel instanceof VoiceChannel ||
            purgeChannel instanceof StageChannel ||
            purgeChannel instanceof CategoryChannel
        ) {
            await interaction.reply(`:x: The channel ${purgeChannel} is not a text channel.`);
            return;
        }
        const numMessagesPurged = await this.purgeMessages(purgeUser, purgeChannel);
        await interaction.reply(
            numMessagesPurged === 0
                ? `:x: Failed to purge messages from ${purgeUser} in ${purgeChannel}. This could be because the user has no messages in the specified channel, or all messages from the user in the channel are older than 14 days.`
                : `:white_check_mark: Successfully purged **${numMessagesPurged}** message${numMessagesPurged > 1 ? "s" : ""} from ${purgeUser} in ${purgeChannel}.`
        );
    }
};
