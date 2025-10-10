const axios = require('axios');

module.exports = {
    name: 'dadjoke',
    description: 'Get a random dad joke.',
    aliases: ['joke'],
    cooldown: 5,
    async execute(client, message, args) {
        try {
            await message.edit('Searching for a dad joke... 👨').catch(() => {});
            const response = await axios.get('https://icanhazdadjoke.com/', {
                headers: {
                    'Accept': 'application/json'
                }
            });
            await message.edit(`**Dad Joke:**\n${response.data.joke}`).catch(() => {});
        } catch (error) {
            console.error("Dad joke API error:", error);
            await message.edit('Sorry, I couldn\'t fetch a joke right now. Please try again later.').catch(() => {});
        }
    }
};