const axios = require('axios');

module.exports = {
    name: 'numberfact',
    description: 'Get a random fact about a number.',
    aliases: ['numfact'],
    cooldown: 5,
    async execute(client, message, args) {
        const number = args[0] || 'random';
        const type = args[1] || 'trivia';

        try {
            await message.edit(`Fetching a fact for number **${number}**... 🔢`).catch(() => {});
            const response = await axios.get(`http://numbersapi.com/${number}/${type}`);
            await message.edit(`**Fact about ${number} (${type}):**\n${response.data}`).catch(() => {});
        } catch (error) {
            console.error("Number fact API error:", error);
            await message.edit('Sorry, I couldn\'t fetch a fact. The number might be invalid or the API is down.').catch(() => {});
        }
    }
};