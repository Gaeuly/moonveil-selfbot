const axios = require('axios');

module.exports = {
    name: 'funfact',
    description: 'Displays a random fun fact.',
    cooldown: 5,
    async execute(client, message, args) {
        try {
            const response = await axios.get('https://uselessfacts.jsph.pl/random.json?language=en');
            const fact = response.data.text;
            
            await message.edit(`💡 **Fun Fact:**\n${fact}`).catch(() => {});

        } catch (error) {
            console.error('Funfact error:', error);
            await message.edit('Sorry, I couldn\'t fetch a fun fact right now.').catch(() => {});
        }
    }
};