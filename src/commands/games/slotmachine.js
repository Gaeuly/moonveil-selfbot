module.exports = {
    name: 'slotmachine',
    description: 'Play a simple slot machine.',
    aliases: ['slots'],
    cooldown: 5,
    async execute(client, message, args) {
        const symbols = ['🍒', '🍋', '🍉', '⭐', '💎', '🔔'];
        
        const reels = [
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)]
        ];

        let result;
        if (reels[0] === reels[1] && reels[1] === reels[2]) {
            result = '🎉 JACKPOT! You won! 🎉';
        } else if (reels[0] === reels[1] || reels[1] === reels[2] || reels[0] === reels[2]) {
            result = '✨ Close! You got two in a row. Try again!';
        } else {
            result = '😢 You lost. Better luck next time!';
        }

        const response = `**[ ${reels.join(' | ')} ]**\n\n${result}`;
        await message.edit(response).catch(() => {});
    }
};