const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {
    name: 'etymology',
    description: 'Finds the origin of a word.',
    aliases: ['origin'],
    cooldown: 20,
    async execute(client, message, args) {
        if (!args.length) {
            return message.edit('Please provide a word to look up.').catch(() => {});
        }
        const word = args[0].toLowerCase();

        const progressMsg = await message.edit(`🔍 Searching etymology for **${word}**...`).catch(() => {});

        try {
            const response = await axios.get(`https://www.etymonline.com/word/${word}`);
            const $ = cheerio.load(response.data);
            
            const firstParagraph = $('section[class*="word__defination--"] p').first().text().trim();

            if (!firstParagraph) {
                throw new Error('Could not find etymology on the page.');
            }

            const etymologyReport = `**Etymology of "${word}"**\n\n` +
                                    `> ${firstParagraph.substring(0, 1800)}...\n\n` +
                                    `*Source: etymonline.com*`;

            await message.edit(etymologyReport).catch(() => {});

        } catch (error) {
            console.error("Etymology error:", error.message);
            await message.edit(`❌ Could not find the etymology for **${word}**. Please check the spelling.`).catch(() => {});
        }
    }
};