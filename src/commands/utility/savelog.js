const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'savelog',
    description: 'Fetches and saves recent messages from the current channel to a text file.',
    aliases: ['log'],
    cooldown: 20,
    async execute(client, message, args) {
        const limit = parseInt(args[0]) || 100;

        if (limit > 1000) {
            return message.edit('You can only save a maximum of 1000 messages at a time.').catch(() => {});
        }

        const logDir = path.join(__dirname, '..', '..', '..', 'logs');
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }

        try {
            await message.edit(`📦 Fetching the last ${limit} messages...`).catch(() => {});

            const messages = await message.channel.messages.fetch({ limit: limit });
            const reversedMessages = Array.from(messages.values()).reverse();

            const guildName = message.guild ? message.guild.name.replace(/[^a-z0-9]/gi, '_') : 'DM';
            const channelName = message.channel.name ? message.channel.name.replace(/[^a-z0-9]/gi, '_') : 'channel';
            const timestamp = new Date().toISOString().replace(/:/g, '-');
            const fileName = `${guildName}_${channelName}_${timestamp}.txt`;
            const filePath = path.join(logDir, fileName);

            let logContent = `Log of #${message.channel.name} in ${message.guild.name} at ${new Date().toLocaleString()}\n`;
            logContent += `Total messages saved: ${reversedMessages.length}\n\n`;
            logContent += '--------------------------------------------------\n\n';

            for (const msg of reversedMessages) {
                const time = new Date(msg.createdTimestamp).toLocaleString();
                logContent += `[${time}] ${msg.author.tag}:\n${msg.content}\n\n`;
            }

            fs.writeFileSync(filePath, logContent);

            await message.edit(`✅ Log saved successfully! You can find it at: \`${filePath}\``).catch(() => {});

        } catch (error) {
            console.error('SaveLog command error:', error);
            await message.edit('❌ An error occurred while saving the log.').catch(() => {});
        }
    }
};