const axios = require('axios');
const Jimp = require('jimp');
const jsQR = require('jsqr');

module.exports = {
    name: 'qrdecode',
    description: 'Decode a QR code from an image URL.',
    aliases: ['readqr'],
    async execute(client, message, args) {
        const imageUrl = args[0];
        if (!imageUrl) {
            return message.edit('Usage: `!qrdecode <image_url>`').catch(() => {});
        }

        try {
            await message.edit('🔍 Reading QR code...').catch(() => {});

            const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const image = await Jimp.read(response.data);

            const qrCode = jsQR(image.bitmap.data, image.bitmap.width, image.bitmap.height);

            if (qrCode) {
                await message.edit(`**📱 QR Code Found!**\n\`\`\`\n${qrCode.data}\n\`\`\``).catch(() => {});
            } else {
                await message.edit('❌ Could not find a QR code in the image.').catch(() => {});
            }
        } catch (error) {
            console.error(error);
            await message.edit('Failed to process the image. Please ensure the URL is valid.').catch(() => {});
        }
    }
};