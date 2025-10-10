function spinWheel() {
    const number = Math.floor(Math.random() * 37); // 0-36
    let color;
    if (number === 0) {
        color = 'green';
    } else if ([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(number)) {
        color = 'red';
    } else {
        color = 'black';
    }
    return { number, color };
}

function checkWin(betType, result) {
    const { number, color } = result;
    if (betType === color) return true;
    if (betType === 'even' && number !== 0 && number % 2 === 0) return true;
    if (betType === 'odd' && number % 2 === 1) return true;
    if (betType === 'low' && number >= 1 && number <= 18) return true;
    if (betType === 'high' && number >= 19 && number <= 36) return true;
    if (betType === '1st12' && number >= 1 && number <= 12) return true;
    if (betType === '2nd12' && number >= 13 && number <= 24) return true;
    if (betType === '3rd12' && number >= 25 && number <= 36) return true;
    if (parseInt(betType) === number) return true;
    return false;
}

module.exports = {
    name: 'roulette',
    description: 'Play a game of Roulette.',
    aliases: ['rl'],
    cooldown: 10,
    async execute(client, message, args) {
        const betType = args[0] ? args[0].toLowerCase() : null;

        const validBets = ['red', 'black', 'green', 'even', 'odd', 'high', 'low', '1st12', '2nd12', '3rd12'];
        const isNumberBet = !isNaN(parseInt(betType)) && parseInt(betType) >= 0 && parseInt(betType) <= 36;

        if (!betType || (!validBets.includes(betType) && !isNumberBet)) {
            const betList = validBets.map(b => `\`${b}\``).join(', ');
            return message.edit(`**Please place a valid bet.**\nUsage: \`!roulette <bet>\`\nBets: ${betList}, or a number from \`0\` to \`36\`.`).catch(() => {});
        }

        await message.edit('🎡 The wheel is spinning...').catch(() => {});
        const result = spinWheel();

        // Add a fake delay for suspense
        setTimeout(async () => {
            const won = checkWin(betType, result);
            const colorEmoji = result.color === 'red' ? '🔴' : result.color === 'black' ? '⚫' : '🟢';

            let response = `**Roulette**\n`;
            response += `You bet on: **${betType.toUpperCase()}**\n`;
            response += `The ball landed on: ${colorEmoji} **${result.number}**\n\n`;
            response += won ? `**You win! 🎉**` : `**You lose. 😢**`;

            await message.edit(response).catch(() => {});
        }, 2000); // 2-second delay
    }
};