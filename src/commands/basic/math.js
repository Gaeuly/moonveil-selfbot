const { evaluate } = require('mathjs');

module.exports = {
    name: 'math',
    description: 'Evaluates a mathematical expression.',
    aliases: ['calculate', 'calc'],
    cooldown: 3,
    async execute(client, message, args) {
        const expression = args.join(' ');

        if (!expression) {
            return message.edit('Please provide a mathematical expression to evaluate.').catch(() => {});
        }

        try {
            const result = evaluate(expression);
            await message.edit(`\`\`\`\nExpression: ${expression}\nResult: ${result}\n\`\`\``);
        } catch (error) {
            await message.edit(`Invalid expression. Please check your input.`).catch(() => {});
        }
    }
};