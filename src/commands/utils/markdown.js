module.exports = {
    name: 'markdown',
    description: 'Previews Discord markdown formatting.',
    aliases: ['md'],
    async execute(client, message, args) {
        const text = args.join(' ');

        if (!text) {
            const helpText = `**Markdown Preview Help**
Usage: \`!md <text>\`
Example: \`!md **Bold** *Italic* \`\`\`js\nconsole.log('Hello');\n\`\`\` \``;
            return message.edit(helpText).catch(() => {});
        }

        const preview = `**📝 Markdown Preview**
**Input:** \`\`\`
${text.replace(/`/g, '\\`')}
\`\`\`
**Output:**
${text}`;

        await message.edit(preview).catch(() => {});
    }
};