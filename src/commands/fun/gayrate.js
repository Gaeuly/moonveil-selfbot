module.exports = {
    name: 'gayrate',
    description: 'Rates how gay a user is.',
    aliases: ['howgay'],
    cooldown: 5,
    async execute(client, message, args) {
        const member = message.mentions.users.first();
        const targetUser = member || client.users.cache.get(args[0]) || message.author;
        const gayness = Math.floor(Math.random() * 101);

        const filled = Math.round(gayness / 10);
        const bar = '█'.repeat(filled) + '░'.repeat(10 - filled);

        const response = `**Gayness Rating for ${targetUser.username}** 🏳️‍🌈\n> [${bar}] **${gayness}%**`;
        await message.edit(response).catch(() => {});
    }
};