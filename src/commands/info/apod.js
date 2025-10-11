const axios = require('axios');

module.exports = {
    name: 'apod',
    description: 'Gets the NASA Astronomy Picture of the Day.',
    aliases: ['nasa', 'space'],
    cooldown: 20,
    async execute(client, message, args) {
        const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
        
        try {
            const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`);
            const data = response.data;

            let apodMessage = `**${data.title}** (${data.date})\n\n`;
            apodMessage += `${data.explanation.substring(0, 1500)}...\n\n`;
            
            if (data.media_type === 'image') {
                apodMessage += `**Image URL:** ${data.hdurl || data.url}`;
            } else if (data.media_type === 'video') {
                apodMessage += `**Video URL:** ${data.url}`;
            }

            await message.edit(apodMessage).catch(() => {});

        } catch (error) {
            console.error('APOD error:', error);
            await message.edit('Failed to fetch the Astronomy Picture of the Day.').catch(() => {});
        }
    }
};