const axios = require('axios');

module.exports = {
    name: 'quote',
    description: 'Gets a random inspirational quote.',
    cooldown: 10,
    async execute(client, message, args) {
        try {
            const response = await axios.get('https://api.quotable.io/random');
            const quoteData = response.data;

            const quoteMessage = `_"${quoteData.content}"_\n\n` +
                                 `**- ${quoteData.author}**`;

            await message.edit(quoteMessage).catch(() => {});
        } catch (error) {
            console.error('Quote error:', error);
            await message.edit('Failed to fetch a quote at this time.').catch(() => {});
        }
    }
};