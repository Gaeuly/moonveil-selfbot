module.exports = {
    name: 'spam',
    description: 'Spams a message a specified number of times.',
    cooldown: 20,
    
    async execute(client, message, args) {
        const count = parseInt(args[0]);
        const textToSpam = args.slice(1).join(' ');

        if (isNaN(count) || count <= 0) {
            return message.edit('Usage: `!spam <amount> <message>`').catch(() => {});
        }
        
        if (!textToSpam) {
            return message.edit('Please provide a message to spam.').catch(() => {});
        }

        const spamCount = Math.min(count, 10);
        
        await message.delete().catch(() => {});
        for (let i = 0; i < spamCount; i++) {
            await message.channel.send(textToSpam);
        }
    }
};