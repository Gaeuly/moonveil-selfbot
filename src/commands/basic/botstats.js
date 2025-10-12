const { version } = require('discord.js-selfbot-v13');
const os = require('os');

module.exports = {
    name: "botstats",
    description: "Displays detailed performance and client statistics.",
    aliases: ['botstats', 'info'],
    cooldown: 10,
    async execute(client, message, args) {
        try {
            const uptime = process.uptime();
            const days = Math.floor(uptime / 86400);
            const hours = Math.floor((uptime % 86400) / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            const seconds = Math.floor(uptime % 60);
            const uptimeFormatted = `${days}d ${hours}h ${minutes}m ${seconds}s`;

            const memoryUsage = process.memoryUsage();
            const usedMB = (memoryUsage.heapUsed / 1024 / 1024).toFixed(2);
            const totalMB = (memoryUsage.heapTotal / 1024 / 1024).toFixed(2);

            const guilds = client.guilds.cache.size;
            const channels = client.channels.cache.size;
            const users = client.users.cache.size;

            const statsReport = `
\`\`\`asciidoc
= STATISTICS =

[Client]
• User      :: ${client.user.tag}
• Guilds    :: ${guilds}
• Channels  :: ${channels}
• Users     :: ${users}
• Ping      :: ${Math.round(client.ws.ping)}ms

[Host]
• OS        :: ${os.type()} ${os.release()} (${os.arch()})
• CPU       :: ${os.cpus()[0].model}
• RAM       :: ${usedMB}MB / ${totalMB}MB
• Uptime    :: ${uptimeFormatted}

[Versions]
• Node.js   :: ${process.version}
• Discord.js:: v${version}
\`\`\`
            `;

            await message.edit(statsReport);

        } catch (error) {
            console.error("Stats command error:", error);
            await message.edit(`❌ Error: Failed to generate client stats.`).catch(() => {});
        }
    }
};