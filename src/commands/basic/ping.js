module.exports = {
    name: 'ping',
    description: 'Checks the client and API latency.',
    aliases: ['pong', 'latency'],
    cooldown: 5,
    async execute(client, message, args) {
        try {
            const initialMessage = await message.edit('🏓 Pinging...');
            const botLatency = initialMessage.createdTimestamp - message.createdTimestamp;
            const apiLatency = Math.round(client.ws.ping);

            await initialMessage.edit(`🏓 Pong!\n- Bot Latency: \`${botLatency}ms\`\n- API Latency: \`${apiLatency}ms\``);
        } catch (error) {
            console.error("Ping command error:", error);
        }
    }
};