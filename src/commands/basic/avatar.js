module.exports = {
    name: 'avatar',
    description: 'Displays the avatar of a mentioned user or the author.',
    aliases: ['av'],
    async execute(client, message, args) {
        const user = message.mentions.users.first() || message.author;
        const avatarURL = user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' });

        await message.edit(`**${user.username}'s Avatar:**\n${avatarURL}`).catch(() => {});
    }
};