const axios = require('axios');

module.exports = {
    name: 'dictionary',
    description: 'Looks up a word in the dictionary.',
    aliases: ['dict', 'define'],
    cooldown: 10,
    async execute(client, message, args) {
        if (!args.length) {
            return message.edit('Please provide a word to look up.').catch(() => {});
        }

        const word = args[0].toLowerCase();

        try {
            const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            const entry = response.data[0];
            
            let dictReport = `**Dictionary: ${word}**\n\n`;

            if (entry.phonetic) {
                dictReport += `> **Pronunciation:** ${entry.phonetic}\n\n`;
            }

            entry.meanings.slice(0, 3).forEach((meaning, index) => {
                dictReport += `**${index + 1}. As a ${meaning.partOfSpeech}**\n`;
                const definition = meaning.definitions[0];
                dictReport += `> ${definition.definition}\n`;
                if (definition.example) {
                    dictReport += `> *Example: "${definition.example}"*\n`;
                }
                dictReport += `\n`;
            });

            await message.edit(dictReport.trim()).catch(() => {});

        } catch (error) {
            await message.edit(`Could not find dictionary information for **${word}**.`).catch(() => {});
        }
    }
};