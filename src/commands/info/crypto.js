const axios = require('axios');

module.exports = {
    name: 'crypto',
    description: 'Fetches information about a cryptocurrency.',
    aliases: ['coin', 'price'],
    cooldown: 10,
    async execute(client, message, args) {
        if (!args.length) {
            return message.edit('Please provide a cryptocurrency ID (e.g., `bitcoin`, `ethereum`).').catch(() => {});
        }

        const coinId = args[0].toLowerCase();

        try {
            const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}`);
            const data = response.data;

            if (!data || !data.market_data) {
                return message.edit(`❌ Could not find data for **${coinId}**.`).catch(() => {});
            }

            const name = data.name;
            const symbol = data.symbol.toUpperCase();
            const price = data.market_data.current_price.usd.toLocaleString();
            const change24h = data.market_data.price_change_percentage_24h?.toFixed(2) || 0;
            const marketCap = data.market_data.market_cap.usd.toLocaleString();
            const volume = data.market_data.total_volume.usd.toLocaleString();

            const infoMessage = 
`**${name} (${symbol})**
> **Price:** $${price}
> **24h Change:** ${change24h}%
> **Market Cap:** $${marketCap}
> **24h Volume:** $${volume}`;

            await message.edit(infoMessage).catch(() => {});

        } catch (error) {
            console.error('Crypto command error:', error);
            await message.edit('❌ Error fetching crypto info. Please try again later.').catch(() => {});
        }
    }
};