const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'qrcode',
    description: 'Generates a QR code from text or a link.',
    aliases: ['qr'],
    cooldown: 10,
    async execute(client, message, args) {
        const textToEncode = args.join(' ');

        if (!textToEncode) {
            return message.edit('Please provide text or a link to generate a QR code.').catch(() => {});
        }

        try {
            await message.delete().catch(() => {});
            
            const tempDir = path.join(__dirname, '..', '..', '..', 'temp');
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true });
            }
            
            const filePath = path.join(tempDir, `qr_${Date.now()}.png`);
            await QRCode.toFile(filePath, textToEncode, { width: 512 });

            await message.channel.send({
                content: `QR Code for: \`${textToEncode}\``,
                files: [filePath]
            });

            fs.unlinkSync(filePath);

        } catch (error) {
            console.error("QRCode error:", error);
            const errorMsg = await message.channel.send('Failed to generate QR code. Please ensure the input is valid.');
            setTimeout(() => errorMsg.delete().catch(() => {}), 5000);
        }
    }
};