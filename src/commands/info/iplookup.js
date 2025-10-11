const axios = require('axios');

module.exports = {
    name: 'iplookup',
    description: 'Looks up information about an IP address.',
    aliases: ['ip'],
    cooldown: 15,
    async execute(client, message, args) {
        if (args.length === 0) {
            return message.edit('Please provide an IP address to look up.').catch(() => {});
        }
        const ipAddress = args[0];

        try {
            const response = await axios.get(`http://ip-api.com/json/${ipAddress}`);
            const data = response.data;

            if (data.status === 'fail') {
                return message.edit(`Could not find information for IP: **${ipAddress}**`).catch(() => {});
            }

            const ipInfoMessage = `**IP Address Info: ${data.query}**\n\n` +
                                  `> **Country:** ${data.country} (${data.countryCode})\n` +
                                  `> **Region:** ${data.regionName}\n` +
                                  `> **City:** ${data.city}\n` +
                                  `> **ISP:** ${data.isp}\n` +
                                  `> **Organization:** ${data.org}`;

            await message.edit(ipInfoMessage).catch(() => {});
        } catch (error) {
            console.error('IP Lookup error:', error);
            await message.edit('Error looking up the IP address. Please try again later.').catch(() => {});
        }
    }
};