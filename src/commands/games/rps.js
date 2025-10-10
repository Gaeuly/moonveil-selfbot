module.exports = {
    name: 'rps',
    description: 'Play Rock Paper Scissors against the bot.',
    cooldown: 5,
    async execute(client, message, args) {
        const choices = ['rock', 'paper', 'scissors'];
        const userChoice = args[0] ? args[0].toLowerCase() : null;

        if (!userChoice || !choices.includes(userChoice)) {
            return message.edit('Please choose `rock`, `paper`, or `scissors`.').catch(() => {});
        }

        const botChoice = choices[Math.floor(Math.random() * choices.length)];

        let result;
        if (userChoice === botChoice) {
            result = "It's a tie!";
        } else if (
            (userChoice === 'rock' && botChoice === 'scissors') ||
            (userChoice === 'paper' && botChoice === 'rock') ||
            (userChoice === 'scissors' && botChoice === 'paper')
        ) {
            result = 'You win! 🎉';
        } else {
            result = 'I win! 😢';
        }

        const emojis = {
            rock: '✊',
            paper: '✋',
            scissors: '✌️'
        };

        const response = `You chose ${emojis[userChoice]}, I chose ${emojis[botChoice]}.\n\n**${result}**`;
        await message.edit(response).catch(() => {});
    }
};