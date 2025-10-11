const figlet = require('figlet');

module.exports = {
    name: 'ascii',
    description: 'Converts text into ASCII art.',
    cooldown: 5,
    async execute(client, message, args) {
        if (!args.length) {
            return message.edit('Please provide some text to convert.').catch(() => {});
        }

        const text = args.join(' ');

        figlet.text(text, { font: 'Standard' }, (err, data) => {
            if (err) {
                console.error('Figlet error:', err);
                return message.edit('Sorry, something went wrong.').catch(() => {});
            }
            // Discord has a 2000 character limit, so we check
            if (data.length > 1900) {
                 return message.edit('That text is too long to be converted!').catch(() => {});
            }
            message.edit(`\`\`\`\n${data}\n\`\`\``).catch(() => {});
        });
    }
};