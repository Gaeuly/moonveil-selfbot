module.exports = {
    name: 'color',
    description: 'Get information about a color (hex, rgb, hsl).',
    aliases: ['colour', 'hex'],
    async execute(client, message, args) {
        if (args.length === 0) {
            return message.edit('Usage: `!color <#hex_code | color_name>`').catch(() => {});
        }

        const colorInput = args.join(' ').toLowerCase();

        // A small map of common color names to hex codes
        const colorNames = {
            'red': '#ff0000', 'green': '#00ff00', 'blue': '#0000ff', 'yellow': '#ffff00',
            'purple': '#800080', 'orange': '#ffa500', 'pink': '#ffc0cb', 'black': '#000000',
            'white': '#ffffff', 'gray': '#808080', 'cyan': '#00ffff', 'magenta': '#ff00ff'
        };

        let hex = colorNames[colorInput] || colorInput;

        if (!/^#[0-9A-F]{6}$/i.test(hex)) {
             return message.edit('Invalid color format. Please use a hex code like `#RRGGBB` or a common color name.').catch(() => {});
        }
        
        hex = hex.toUpperCase();

        try {
            // Convert HEX to RGB
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);

            const colorInfo = `**🎨 Color Information for ${hex}**
- **RGB**: \`rgb(${r}, ${g}, ${b})\`
- **Integer**: \`${parseInt(hex.slice(1), 16)}\``;

            await message.edit(colorInfo).catch(() => {});

        } catch (error) {
            await message.edit('Failed to process the color.').catch(() => {});
        }
    }
};