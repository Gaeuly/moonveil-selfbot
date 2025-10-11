const axios = require('axios');

module.exports = {
    name: 'urban',
    description: 'Looks up a term on Urban Dictionary.',
    cooldown: 15,
    async execute(client, message, args) {
        if (!args.length) {
            return message.edit('Please provide a term to look up.').catch(() => {});
        }

        try {
            const term = encodeURIComponent(args.join(' '));
            const response = await axios.get(`https://api.urbandictionary.com/v0/define?term=${term}`);
            
            if (!response.data.list.length) {
                return message.edit(`No Urban Dictionary definitions found for **${args.join(' ')}**.`);
            }

            const definition = response.data.list[0];

            const urbanMessage = `**Urban Dictionary: ${definition.word}**\n\n` +
                                 `**Definition:**\n> ${definition.definition.replace(/[\[\]]/g, '')}\n\n` +
                                 `**Example:**\n> *${definition.example.replace(/[\[\]]/g, '')}*\n\n` +
                                 `👍 ${definition.thumbs_up} | 👎 ${definition.thumbs_down}`;

            await message.edit(urbanMessage).catch(() => {});

        } catch (error) {
            console.error('Urban Dictionary error:', error);
            await message.edit('Failed to fetch a definition from Urban Dictionary.').catch(() => {});
        }
    }
};