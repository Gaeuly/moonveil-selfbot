module.exports = {
    name: 'ban',
    description: 'Bans a member from the current server.',
    aliases: [],
    cooldown: 5,
    async execute(client, message, args) {
        if (!message.guild) {
            return message.edit('This command can only be used in a server.').catch(() => {});
        }

        const targetId = message.mentions.users.first()?.id || args[0];
        if (!targetId) {
            return message.edit('Please mention a user or provide a user ID to ban.').catch(() => {});
        }

        const reason = args.slice(1).join(' ') || 'No reason provided.';

        try {
            const memberToBan = await message.guild.members.fetch(targetId).catch(() => null);
            
            if (memberToBan && memberToBan.id === client.user.id) {
                return message.edit("You can't ban yourself.").catch(() => {});
            }

            await message.guild.bans.create(targetId, { reason: reason });
            await message.edit(`✅ Successfully banned user \`${targetId}\` for reason: ${reason}`).catch(() => {});

        } catch (error) {
            console.error('Ban command error:', error);
            await message.edit(`❌ Failed to ban user. Please check if the user ID is correct and if you have the necessary permissions.`).catch(() => {});
        }
    }
};