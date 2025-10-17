module.exports = {
    name: 'reverse',
    description: 'Reverses the provided text.',
    cooldown: 3,
    async execute(client, message, args) {
        if (args.length === 0) {
            return message.edit('Please provide some text to reverse.').catch(() => {});
        }

        const textToReverse = args.join(' ');
        const reversedText = textToReverse.split('').reverse().join('');
        
        await message.edit(`🔁 ${reversedText}`).catch(() => {});
    }
};