module.exports = {
    name: 'kick',
    description: 'Kicks a member from the current server.',
    aliases: [],
    cooldown: 5,
    async execute(client, message, args) {
        if (!message.guild) {
            return message.edit('This command can only be used in a server.').catch(() => {});
        }

        const targetId = message.mentions.users.first()?.id || args[0];
        if (!targetId) {
            return message.edit('Please mention a user or provide a user ID to kick.').catch(() => {});
        }
        
        const reason = args.slice(1).join(' ') || 'No reason provided.';

        try {
            const memberToKick = await message.guild.members.fetch(targetId);

            if (memberToKick.id === client.user.id) {
                return message.edit("You can't kick yourself.").catch(() => {});
            }

            if (!memberToKick.kickable) {
                return message.edit("I cannot kick this user. They may have a higher role.").catch(() => {});
            }

            await memberToKick.kick(reason);
            await message.edit(`✅ Successfully kicked \`${memberToKick.user.tag}\` for reason: ${reason}`).catch(() => {});

        } catch (error) {
            console.error('Kick command error:', error);
            await message.edit(`❌ Failed to kick user. Please check if the user ID is correct and if you have the necessary permissions.`).catch(() => {});
        }
    }
};