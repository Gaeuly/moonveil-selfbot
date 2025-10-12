module.exports = {
    name: 'charcount',
    description: 'Counts characters and words in a given text.',
    aliases: ['cc', 'wordcount'],
    async execute(client, message, args) {
        const text = args.join(' ');

        if (!text) {
            return message.edit('Usage: `!charcount <text>`').catch(() => {});
        }

        const charCount = text.length;
        const wordCount = text.split(/\s+/).filter(Boolean).length;

        const response = `**📊 Text Analysis:**
- **Characters**: ${charCount}
- **Words**: ${wordCount}`;

        await message.edit(response).catch(() => {});
    }
};