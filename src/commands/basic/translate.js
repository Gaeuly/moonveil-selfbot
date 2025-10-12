const { translate } = require('@vitalets/google-translate-api');

module.exports = {
    name: 'translate',
    description: 'Translates text to a specified language.',
    aliases: ['tr'],
    cooldown: 5,
    async execute(client, message, args) {
        const prefix = process.env.PREFIX;
        const targetLanguage = args[0];
        const textToTranslate = args.slice(1).join(' ');

        if (!targetLanguage || !textToTranslate) {
            return message.edit(`Usage: \`${prefix}translate <language> <text>\`\nExample: \`${prefix}translate es Hello World\``).catch(() => {});
        }

        try {
            const { text, from } = await translate(textToTranslate, { to: targetLanguage });
            const output = `
\`\`\`
Translated from [${from.language.iso}] to [${targetLanguage}]

Original:
${textToTranslate}

Translation:
${text}
\`\`\`
            `;
            await message.edit(output);
        } catch (error) {
            console.error('Translate error:', error);
            await message.edit('❌ Translation failed. Please check the language code or try again later.').catch(() => {});
        }
    }
};