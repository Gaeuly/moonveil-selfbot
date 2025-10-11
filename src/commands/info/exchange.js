const axios = require('axios');

module.exports = {
    name: 'exchange',
    description: 'Converts an amount from one currency to another.',
    aliases: ['currency'],
    cooldown: 15,
    async execute(client, message, args) {
        if (args.length < 3) {
            return message.edit('Usage: `!exchange <amount> <from_currency> <to_currency>` (e.g., `!exchange 10 USD IDR`)').catch(() => {});
        }

        const amount = parseFloat(args[0]);
        const fromCurrency = args[1].toUpperCase();
        const toCurrency = args[2].toUpperCase();

        if (isNaN(amount)) {
            return message.edit('Invalid amount. Please provide a number.').catch(() => {});
        }

        try {
            const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
            const exchangeRate = response.data.rates[toCurrency];

            if (!exchangeRate) {
                return message.edit(`Exchange rate from ${fromCurrency} to ${toCurrency} is not available.`).catch(() => {});
            }

            const convertedAmount = (amount * exchangeRate).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            await message.edit(`💰 ${amount} ${fromCurrency} is equal to **${convertedAmount} ${toCurrency}**.`).catch(() => {});
        } catch (error) {
            console.error('Exchange rate error:', error);
            await message.edit('❌ Error fetching exchange rates. Please check the currency codes.').catch(() => {});
        }
    }
};