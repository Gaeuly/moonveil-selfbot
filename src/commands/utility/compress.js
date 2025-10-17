const zlib = require('zlib');
const util = require('util');

const gzip = util.promisify(zlib.gzip);

module.exports = {
    name: 'compress',
    description: 'Compresses text using the Gzip algorithm.',
    aliases: ['zip'],
    cooldown: 5,
    async execute(client, message, args) {
        if (!args.length) {
            return message.edit('Please provide some text to compress.').catch(() => {});
        }

        const text = args.join(' ');

        try {
            const originalSize = Buffer.from(text).length;
            const compressed = await gzip(text);
            const compressedSize = compressed.length;
            const ratio = ((originalSize - compressedSize) / originalSize * 100).toFixed(2);

            const response = `📦 **Text Compression**\n\n` +
                             `**Algorithm:** Gzip\n` +
                             `**Original Size:** ${originalSize} bytes\n` +
                             `**Compressed Size:** ${compressedSize} bytes\n` +
                             `**Saved:** ${ratio}%\n\n` +
                             `**Compressed Data (Base64):**\n\`\`\`${compressed.toString('base64')}\`\`\``;

            await message.edit(response).catch(() => {});

        } catch (error) {
            console.error('Compression error:', error);
            await message.edit('Failed to compress the text.').catch(() => {});
        }
    }
};