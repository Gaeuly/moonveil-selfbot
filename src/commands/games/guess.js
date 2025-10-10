const activeGames = new Map();

module.exports = {
    name: 'guess',
    description: 'Guess a number between 1 and 100.',
    cooldown: 5,
    async execute(client, message, args) {
        const authorId = message.author.id;

        if (!activeGames.has(authorId)) {
            const numberToGuess = Math.floor(Math.random() * 100) + 1;
            activeGames.set(authorId, {
                number: numberToGuess,
                attempts: 0
            });
            await message.edit('🎮 I\'m thinking of a number between 1 and 100. **What is your first guess?**').catch(() => {});
            return;
        }

        const userGuess = parseInt(args[0]);
        if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
            await message.edit('Please enter a valid number between 1 and 100.').catch(() => {});
            return;
        }

        const game = activeGames.get(authorId);
        game.attempts++;

        if (userGuess === game.number) {
            await message.edit(`🎉 **Correct!** You guessed the number **${game.number}** in **${game.attempts}** attempts!`).catch(() => {});
            activeGames.delete(authorId);
        } else if (userGuess < game.number) {
            await message.edit(`🔺 **Too low!** Try a higher number. (Attempt #${game.attempts})`).catch(() => {});
        } else {
            await message.edit(`🔻 **Too high!** Try a lower number. (Attempt #${game.attempts})`).catch(() => {});
        }
    }
};