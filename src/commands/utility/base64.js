module.exports = {
    name: 'base64',
    description: 'Encode or decode Base64 text.',
    aliases: ['b64'],
    async execute(client, message, args) {
        const operation = args[0]?.toLowerCase();
        const text = args.slice(1).join(' ');

        if (!operation || !text || (operation !== 'encode' && operation !== 'decode')) {
            return message.edit('Usage: `!base64 <encode|decode> <text>`').catch(() => {});
        }

        try {
            let result;
            if (operation === 'encode') {
                result = Buffer.from(text).toString('base64');
                await message.edit(`**Base64 Encoded:**\n\`\`\`${result}\`\`\``).catch(() => {});
            } else { // decode
                result = Buffer.from(text, 'base64').toString('utf8');
                await message.edit(`**Base64 Decoded:**\n\`\`\`${result}\`\`\``).catch(() => {});
            }
        } catch (error) {
            await message.edit('Invalid Base64 string for decoding.').catch(() => {});
        }
    }
};