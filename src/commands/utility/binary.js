module.exports = {
    name: 'binary',
    description: 'Convert text to/from binary.',
    aliases: ['bin'],
    async execute(client, message, args) {
        const operation = args[0]?.toLowerCase();
        const text = args.slice(1).join(' ');

        if (!operation || !text || (operation !== 'encode' && operation !== 'decode')) {
            return message.edit('Usage: `!binary <encode|decode> <text>`').catch(() => {});
        }

        try {
            let result;
            if (operation === 'encode') {
                result = text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
                await message.edit(`**Binary Encoded:**\n\`\`\`${result}\`\`\``).catch(() => {});
            } else { // decode
                const decodedText = text.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
                await message.edit(`**Binary Decoded:**\n\`\`\`${decodedText}\`\`\``).catch(() => {});
            }
        } catch (error) {
            await message.edit('Invalid input for the chosen operation.').catch(() => {});
        }
    }
};