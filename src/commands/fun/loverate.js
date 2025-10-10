module.exports = {
    name: 'loverate',
    description: 'Rates the love compatibility between two users.',
    aliases: ['ship', 'love'],
    cooldown: 5,
    async execute(client, message, args) {
        const users = message.mentions.users;
        if (users.size < 1) {
            return message.edit('Please mention at least one user to rate!').catch(() => {});
        }

        const user1 = message.author;
        const user2 = users.first();

        if (!user2) {
             return message.edit('Could not find the mentioned user.').catch(() => {});
        }
        
        // Ensure user2 is not the same as user1 if only one mention
        if(user1.id === user2.id && users.size === 1){
            return message.edit('You cannot rate your love compatibility with yourself!').catch(() => {});
        }

        const compatibility = Math.floor(Math.random() * 101);
        const filled = Math.round(compatibility / 10);
        const bar = '█'.repeat(filled) + '░'.repeat(10 - filled);

        const verdict =
            compatibility >= 90 ? '💖 Perfect match!' :
            compatibility >= 70 ? '💘 Great chemistry!' :
            compatibility >= 50 ? '💞 Could work with effort.' :
            compatibility >= 30 ? '💔 Not ideal, but who knows?' :
            '🧊 It’s complicated...';

        const response = `**💘 Love Compatibility**\n> ${user1.username} + ${user2.username}\n**${compatibility}%** | ${bar}\n**Verdict:** ${verdict}`;
        await message.edit(response).catch(() => {});
    }
};