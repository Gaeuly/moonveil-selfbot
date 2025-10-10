const activeGames = new Map();

function createDeck() {
    const suits = ['♥', '♦', '♣', '♠'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const deck = [];
    for (const suit of suits) {
        for (const value of values) {
            deck.push({ value, suit });
        }
    }
    // Shuffle deck
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

function calculateHandValue(hand) {
    let value = 0;
    let aces = 0;
    for (const card of hand) {
        if (card.value === 'A') {
            aces++;
            value += 11;
        } else if (['K', 'Q', 'J'].includes(card.value)) {
            value += 10;
        } else {
            value += parseInt(card.value);
        }
    }
    while (value > 21 && aces > 0) {
        value -= 10;
        aces--;
    }
    return value;
}

function formatHand(hand) {
    return hand.map(card => `\`${card.value}${card.suit}\``).join(' ');
}

async function updateGameDisplay(message, game) {
    let display = `**Blackjack** 🃏\n\n`;
    display += `**Your Hand:** ${formatHand(game.playerHand)} (Value: **${calculateHandValue(game.playerHand)}**)\n`;
    display += `**Dealer's Hand:** ${game.state === 'playing' ? `\`${game.dealerHand[0].value}${game.dealerHand[0].suit}\` \`??\`` : `${formatHand(game.dealerHand)} (Value: **${calculateHandValue(game.dealerHand)}**)`}\n\n`;

    if (game.state === 'playing') {
        display += `*Click 🇭 to Hit, 🇸 to Stand.*`;
    } else {
        display += `**Result:** ${game.result}`;
    }
    await message.edit(display).catch(() => {});
}

async function playDealerHand(game) {
    while (calculateHandValue(game.dealerHand) < 17) {
        game.dealerHand.push(game.deck.pop());
    }
}

function determineWinner(game) {
    const playerValue = calculateHandValue(game.playerHand);
    const dealerValue = calculateHandValue(game.dealerHand);

    if (playerValue > 21) return 'You busted! Dealer wins. 😢';
    if (dealerValue > 21) return 'Dealer busted! You win! 🎉';
    if (playerValue === 21 && game.playerHand.length === 2) return 'Blackjack! You win! 🥳';
    if (playerValue > dealerValue) return 'You win! 🎉';
    if (dealerValue > playerValue) return 'Dealer wins. 😢';
    return 'Push! It\'s a tie. 😐';
}

module.exports = {
    name: 'blackjack',
    description: 'Play a game of Blackjack against the dealer.',
    aliases: ['bj', '21'],
    cooldown: 15,
    async execute(client, message, args) {
        const authorId = message.author.id;
        if (activeGames.has(authorId)) {
            return message.edit('You already have an active Blackjack game! Finish it first.').catch(() => {});
        }

        const game = {
            deck: createDeck(),
            playerHand: [],
            dealerHand: [],
            state: 'playing',
            result: ''
        };

        game.playerHand.push(game.deck.pop(), game.deck.pop());
        game.dealerHand.push(game.deck.pop(), game.deck.pop());

        activeGames.set(authorId, game);
        const gameMessage = await message.edit('Starting Blackjack...').catch(() => {});
        if (!gameMessage) return;

        await updateGameDisplay(gameMessage, game);

        const playerValue = calculateHandValue(game.playerHand);
        if (playerValue === 21) {
            game.state = 'finished';
            game.result = 'Blackjack! You win! 🥳';
            await updateGameDisplay(gameMessage, game);
            activeGames.delete(authorId);
            return;
        }

        try {
            await gameMessage.react('🇭');
            await gameMessage.react('🇸');
        } catch (error) {
            console.error('Failed to add reactions:', error);
            activeGames.delete(authorId);
            return;
        }

        const filter = (reaction, user) => ['🇭', '🇸'].includes(reaction.emoji.name) && user.id === authorId;
        const collector = gameMessage.createReactionCollector({ filter, time: 60000, max: 1 });

        collector.on('collect', async (reaction) => {
            if (game.state !== 'playing') return;

            if (reaction.emoji.name === '🇭') { // Hit
                game.playerHand.push(game.deck.pop());
                const newPlayerValue = calculateHandValue(game.playerHand);
                if (newPlayerValue >= 21) {
                    // Game ends automatically if player hits 21 or busts
                    collector.stop();
                    return;
                }
                await updateGameDisplay(gameMessage, game);
                // Restart collector for next move
                const newCollector = gameMessage.createReactionCollector({ filter, time: 60000, max: 1 });
                newCollector.on('collect', collector.options.onCollect);
                newCollector.on('end', collector.options.onEnd);
                collector.stop(); // stop the old one
            } else if (reaction.emoji.name === '🇸') { // Stand
                collector.stop();
            }
        });

        collector.on('end', async () => {
            if (game.state !== 'playing') return; // already finished by a bust or blackjack

            await playDealerHand(game);
            game.state = 'finished';
            game.result = determineWinner(game);
            await updateGameDisplay(gameMessage, game);
            activeGames.delete(authorId);
        });
    }
};