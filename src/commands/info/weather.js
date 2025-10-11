const axios = require('axios');

module.exports = {
    name: 'weather',
    description: 'Gets weather information for a specified location.',
    cooldown: 25,
    async execute(client, message, args) {
        if (!args.length) {
            return message.edit('Please provide a location to check the weather.').catch(() => {});
        }
        const location = args.join(' ');

        try {
            const response = await axios.get(`https://wttr.in/${encodeURIComponent(location)}?format=j1`);
            const data = response.data.current_condition[0];
            const area = response.data.nearest_area[0];

            const weatherInfo = `**Weather in ${area.areaName[0].value}, ${area.country[0].value}**\n\n` +
                                `> **Condition:** ${data.weatherDesc[0].value}\n` +
                                `> **Temperature:** ${data.temp_C}°C / ${data.temp_F}°F\n` +
                                `> **Feels Like:** ${data.FeelsLikeC}°C / ${data.FeelsLikeF}°F\n` +
                                `> **Wind:** ${data.windspeedKmph} km/h\n` +
                                `> **Humidity:** ${data.humidity}%`;
            
            await message.edit(weatherInfo).catch(() => {});
        } catch (error) {
            console.error('Weather error:', error);
            await message.edit(`Could not fetch weather information for **${location}**.`).catch(() => {});
        }
    }
};