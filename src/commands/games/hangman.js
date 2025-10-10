const activeGames = new Map();
const maxAttempts = 6;

const wordList = {
    general: ["javascript", "discord", "hangman", "programming", "developer", "computer", "keyboard", "internet", "algorithm", "database"],
    animals: ["elephant", "giraffe", "hippopotamus", "crocodile", "rhinoceros", "chimpanzee", "gorilla", "penguin", "dolphin", "octopus"],
    countries: ["indonesia", "malaysia", "singapore", "thailand", "vietnam", "philippines", "australia", "japan", "brazil", "canada"],
};

function renderHangman(game) {
    const stages = [
        "  +---+\n  |   |\n      |\n      |\n      |\n      |\n=========", // 6 attempts left
        "  +---+\n  |   |\n  O   |\n      |\n      |\n      |\n=========", // 5 attempts left
        "  +---+\n  |   |\n  O   |\n  |   |\n      |\n      |\n=========", // 4 attempts left
        "  +---+\n  |   |\n  O   |\n /|   |\n      |\n      |\n=========", // 3 attempts left
        "  +---+\n  |   |\n  O   |\n /|\\  |\n      |\n      |\n=========", // 2 attempts left
        "  +---+\n  |   |\n  O   |\n /|\\  |\n /    |\n      |\n=========", // 1 attempt left
        "  +---+\n  |   |\n  O   |\n /|\\  |\n / \\  |\n      |\n========="  // 0 attempts left
    ];
    return `\`\`\`${stages[maxAttempts - game.attempts]}\`\`\``;
}

function getHelpMessage() {
    const categories = Object.keys(wordList).map(c => `\`${c}\``).join(', ');
    return `**Hangman Game Help** 🎮\n\n` +
           `**Commands:**\n` +
           `• \`!hangman start [category]\` - Starts a new game. If no category is chosen, it defaults to 'general'.\n` +
           `• \`!hangman guess <letter>\` - Guesses a letter.\n` +
           `• \`!hangman stop\` - Stops the current game.\n\n` +
           `**Available Categories:** ${categories}`;
}

module.exports = {
    name: 'hangman',
    description: 'Play a game of Hangman.',
    cooldown: 10,
    async execute(client, message, args) {
        const authorId = message.author.id;
        const subCommand = args[0] ? args[0].toLowerCase() : '';

        if (!subCommand) {
            return message.edit(getHelpMessage()).catch(() => {});
        }

        const game = activeGames.get(authorId);

        if (subCommand === 'start') {
            if (game) {
                return message.edit('You already have an active Hangman game! Use `!hangman stop` to end it.').catch(() => {});
            }

            const category = args[1] ? args[1].toLowerCase() : 'general';
            if (!wordList[category]) {
                return message.edit(`Invalid category! Available categories: ${Object.keys(wordList).join(', ')}`).catch(() => {});
            }

            const word = wordList[category][Math.floor(Math.random() * wordList[category].length)];
            const newGame = {
                word: word,
                category: category,
                progress: Array(word.length).fill('_'),
                guessedLetters: [],
                attempts: maxAttempts
            };

            activeGames.set(authorId, newGame);
            
            const response = `**Hangman game started!** (Category: ${category})\n\n` +
                             `${renderHangman(newGame)}\n` +
                             `Word: \`${newGame.progress.join(' ')}\`\n\n` +
                             `Guess a letter with \`!hangman guess <letter>\``;

            return message.edit(response).catch(() => {});
        }

        if (!game) {
            return message.edit('No active game! Start one with `!hangman start [category]`.').catch(() => {});
        }

        if (subCommand === 'guess') {
            const letter = args[1] ? args[1].toLowerCase() : '';
            if (!letter || letter.length !== 1 || !/[a-z]/.test(letter)) {
                return message.edit('Please provide a single letter to guess.').catch(() => {});
            }

            if (game.guessedLetters.includes(letter)) {
                return message.edit(`You have already guessed the letter **'${letter}'**!`).catch(() => {});
            }

            game.guessedLetters.push(letter);
            let correctGuess = false;
            for (let i = 0; i < game.word.length; i++) {
                if (game.word[i] === letter) {
                    game.progress[i] = letter;
                    correctGuess = true;
                }
            }

            if (!correctGuess) {
                game.attempts--;
            }

            if (game.progress.join('') === game.word) {
                activeGames.delete(authorId);
                const winResponse = `🎉 **You won!** 🎉\n\n` +
                                    `The word was **\`${game.word}\`**.`;
                return message.edit(winResponse).catch(() => {});
            }

            if (game.attempts <= 0) {
                activeGames.delete(authorId);
                const loseResponse = `💀 **You lost!** 💀\n\n` +
                                     `The word was **\`${game.word}\`**.\n` +
                                     `${renderHangman(game)}`;
                return message.edit(loseResponse).catch(() => {});
            }
            
            const gameUpdateResponse = `**Hangman** (Category: ${game.category})\n\n` +
                                       `${renderHangman(game)}\n` +
                                       `Word: \`${game.progress.join(' ')}\`\n` +
                                       `Guessed: ${game.guessedLetters.join(', ')}\n` +
                                       `Attempts left: **${game.attempts}**`;
            return message.edit(gameUpdateResponse).catch(() => {});
        }

        if (subCommand === 'stop') {
            if (game) {
                activeGames.delete(authorId);
                return message.edit(`Game stopped. The word was **\`${game.word}\`**.`).catch(() => {});
            } else {
                return message.edit('There is no active game to stop.').catch(() => {});
            }
        }
        
        return message.edit(getHelpMessage()).catch(() => {});
    }
};