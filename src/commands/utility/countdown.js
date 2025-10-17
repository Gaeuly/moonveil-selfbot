module.exports = {
    name: 'countdown',
    description: 'Starts a countdown timer.',
    aliases: ['cd', 'timer'],
    async execute(client, message, args) {
        const timeRegex = /(\d+)(s|m|h|d)/g;
        const timeArg = args[0];
        const reason = args.slice(1).join(' ') || "Time's up!";

        if (!timeArg) {
            return message.edit('Usage: `!countdown <time> [message]` (e.g., `1h30m`, `10s`)').catch(() => {});
        }

        let totalSeconds = 0;
        let match;
        while ((match = timeRegex.exec(timeArg.toLowerCase())) !== null) {
            const value = parseInt(match[1]);
            const unit = match[2];
            if (unit === 's') totalSeconds += value;
            if (unit === 'm') totalSeconds += value * 60;
            if (unit === 'h') totalSeconds += value * 3600;
            if (unit === 'd') totalSeconds += value * 86400;
        }

        if (totalSeconds === 0) {
            return message.edit('Invalid time format. Use `d`, `h`, `m`, `s`.').catch(() => {});
        }
        
        if (totalSeconds > 86400) { // Max 1 day
             return message.edit('Maximum countdown is 24 hours.').catch(() => {});
        }

        const endTime = Date.now() + totalSeconds * 1000;

        const timerMessage = await message.edit(`⏰ **Timer set for ${timeArg}!** Reason: *${reason}*`).catch(() => {});

        setTimeout(async () => {
            if (timerMessage) {
                await timerMessage.edit(`**Countdown Finished!**\n> ${reason}`).catch(() => {});
            } else {
                await message.channel.send(`**Countdown Finished!**\n> ${reason}`).catch(() => {});
            }
        }, totalSeconds * 1000);
    }
};