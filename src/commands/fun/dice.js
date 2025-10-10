module.exports = {
    name: 'dice',
    description: 'Roll dice with custom sides and quantity.',
    aliases: ['roll'],
    cooldown: 3,
    async execute(client, message, args) {
        let diceExpression = args[0] ? args[0].toLowerCase() : '1d6';

        try {
            const match = diceExpression.match(/^(\d+)d(\d+)$/i);
            if (!match) throw new Error('Invalid format');

            const quantity = parseInt(match[1]);
            const sides = parseInt(match[2]);

            if (quantity < 1 || quantity > 100 || sides < 2 || sides > 1000) {
                return message.edit('Please use 1-100 for quantity and 2-1000 for sides.').catch(() => {});
            }

            const rolls = [];
            let total = 0;
            for (let i = 0; i < quantity; i++) {
                const roll = Math.floor(Math.random() * sides) + 1;
                rolls.push(roll);
                total += roll;
            }

            const response = `🎲 **Dice Roll: ${quantity}d${sides}**\n- **Total:** ${total}\n- **Rolls:** [${rolls.join(', ')}]`;
            await message.edit(response).catch(() => {});

        } catch (error) {
            await message.edit('Invalid dice format. Use format like `!dice 2d6` or `!dice 1d20`.').catch(() => {});
        }
    }
};