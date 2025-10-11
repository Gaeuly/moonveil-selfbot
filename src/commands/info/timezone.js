const { DateTime } = require('luxon');

module.exports = {
    name: 'timezone',
    description: 'Gets the current time for a specific timezone.',
    aliases: ['tz'],
    cooldown: 10,
    async execute(client, message, args) {
        if (!args.length) {
            return message.edit('Please provide a timezone. Example: `!tz Europe/Paris` or `!tz America/New_York`').catch(() => {});
        }

        const timezone = args.join('_');
        const currentTime = DateTime.now().setZone(timezone);

        if (!currentTime.isValid) {
            return message.edit(`❌ Invalid timezone: **${timezone}**. Please use a valid IANA timezone format (e.g., Continent/City).`).catch(() => {});
        }

        const formattedTime = currentTime.toFormat('HH:mm, dd LLL yyyy');
        const timezoneMessage = `The current time in **${timezone.replace('_', ' ')}** is: \`${formattedTime}\``;

        await message.edit(timezoneMessage).catch(() => {});
    }
};