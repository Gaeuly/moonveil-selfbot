const { DateTime } = require('luxon');

module.exports = {
    name: 'worldtime',
    description: 'Gets the current time in different major cities.',
    aliases: ['wtime'],
    cooldown: 10,
    async execute(client, message, args) {
        const timezones = [
            'America/New_York', 
            'Europe/London', 
            'Asia/Tokyo', 
            'Australia/Sydney', 
            'Europe/Paris', 
            'Asia/Jakarta'
        ];
        
        let timeInfo = '🌍 **World Time**\n\n';
        
        timezones.forEach(tz => {
            const now = DateTime.now().setZone(tz);
            const city = tz.split('/')[1].replace('_', ' ');
            timeInfo += `> **${city}**: ${now.toFormat('HH:mm, dd LLL yyyy')}\n`;
        });
        
        await message.edit(timeInfo).catch(() => {});
    }
};