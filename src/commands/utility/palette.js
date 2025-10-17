const Jimp = require('jimp');
const tinycolor = require('tinycolor2');

module.exports = {
    name: 'palette',
    description: 'Generate a color palette from an image or color value.',
    aliases: ['colors'],
    async execute(client, message, args) {
        const input = args[0];
        if (!input) {
            return message.edit('Usage: `!palette <image_url | #hex_code>`').catch(() => {});
        }

        try {
            if (tinycolor(input).isValid()) {
                const color = tinycolor(input);
                const palette = color.monochromatic(5).map(c => c.toHexString());
                let response = `**🎨 Monochromatic Palette for ${input}**\n`;
                palette.forEach(hex => {
                    response += `> \`${hex}\`\n`;
                });
                await message.edit(response).catch(() => {});
            } else {
                await message.edit('🔍 Analyzing image...').catch(() => {});
                const image = await Jimp.read(input);
                image.quality(60).resize(100, Jimp.AUTO);

                const colorMap = {};
                image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
                    const red = image.bitmap.data[idx + 0];
                    const green = image.bitmap.data[idx + 1];
                    const blue = image.bitmap.data[idx + 2];
                    const hex = tinycolor({ r: red, g: green, b: blue }).toHexString();
                    colorMap[hex] = (colorMap[hex] || 0) + 1;
                });

                const dominantColors = Object.entries(colorMap)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([hex]) => hex);

                let response = '**🎨 Dominant Colors from Image:**\n';
                dominantColors.forEach(hex => {
                    response += `> \`${hex}\`\n`;
                });
                await message.edit(response).catch(() => {});
            }
        } catch (error) {
            console.error(error);
            await message.edit('Failed to generate palette. Please ensure the image URL or hex code is valid.').catch(() => {});
        }
    }
};