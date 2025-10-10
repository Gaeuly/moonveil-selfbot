module.exports = {
    name: 'coinflip',
    description: 'Flips a coin.',
    aliases: ['coin', 'flip'],
    cooldown: 3,
    async execute(client, message, args) {
        const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
        await message.edit(`🪙 The coin landed on **${result}**!`).catch(() => {});
    }
};