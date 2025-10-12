module.exports = {
    name: 'poll',
    description: 'Creates a simple poll with automated reactions.',
    aliases: ['vote'],
    cooldown: 10,
    async execute(client, message, args) {
        const prefix = process.env.PREFIX;
        const pollContent = args.join(' ');
        
        if (!pollContent) {
            return message.edit(`Please provide a question for the poll. Usage: \`${prefix}poll <question>\``).catch(() => {});
        }

        try {
            const pollMessage = await message.edit(`📊 **POLL:** ${pollContent}`);
            await pollMessage.react('👍');
            await pollMessage.react('👎');
            await pollMessage.react('🤷');
        } catch (error) {
            console.error('Poll command error:', error);
            await message.edit('Failed to create the poll. I might be missing permissions to add reactions.').catch(() => {});
        }
    }
};