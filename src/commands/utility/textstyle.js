module.exports = {
    name: 'textstyle',
    description: 'Applies various styles to your text.',
    aliases: ['style'],
    cooldown: 3,
    async execute(client, message, args) {
        const style = args[0] ? args[0].toLowerCase() : '';
        const text = args.slice(1).join(' ');

        const styles = {
            'bold': `**${text}**`,
            'italic': `*${text}*`,
            'underline': `__${text}__`,
            'strike': `~~${text}~~`,
            'code': `\`${text}\``,
            'spoiler': `||${text}||`,
            'upper': text.toUpperCase(),
            'lower': text.toLowerCase()
        };
        
        const availableStyles = Object.keys(styles).map(s => `\`${s}\``).join(', ');

        if (!text || !styles[style]) {
            return message.edit(`**Text Style Help**\nUsage: \`!textstyle <style> <text>\`\n\nAvailable styles: ${availableStyles}`).catch(() => {});
        }
        
        await message.edit(styles[style]).catch(() => {});
    }
};