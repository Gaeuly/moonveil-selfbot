module.exports = {
    name: 'nickname',
    description: 'Changes your own nickname in the current server.',
    aliases: ['nick', 'setnick'],
    cooldown: 10,
    async execute(client, message, args) {
        if (!message.guild) {
            return message.edit('This command can only be used in a server.').catch(() => {});
        }

        const newNickname = args.join(' ');
        if (newNickname.length > 32) {
             return message.edit('Nickname cannot be longer than 32 characters.').catch(() => {});
        }

        try {
            await message.guild.members.me.setNickname(newNickname);
            if (newNickname) {
                await message.edit(`✅ Your nickname has been changed to \`${newNickname}\`.`).catch(() => {});
            } else {
                await message.edit(`✅ Your nickname has been reset.`).catch(() => {});
            }
        } catch (error) {
            console.error('Nickname command error:', error);
            await message.edit('Failed to change nickname. I might be missing permissions.').catch(() => {});
        }
    }
};