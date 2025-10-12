const { Util } = require('discord.js-selfbot-v13');

module.exports = {
    name: 'userinfo',
    description: 'Displays detailed information about a user.',
    aliases: ['whois', 'ui'],
    cooldown: 5,
    async execute(client, message, args) {
        try {
            const userId = message.mentions.users.first()?.id || args[0] || message.author.id;
            const user = await client.users.fetch(userId).catch(() => null);

            if (!user) {
                return message.edit('Could not find that user.').catch(() => {});
            }

            const member = message.guild ? await message.guild.members.fetch(user.id).catch(() => null) : null;
            const creationDate = user.createdAt;
            const roles = member ? member.roles.cache.filter(r => r.id !== message.guild.id).map(r => r.name).join(', ') || 'None' : 'N/A';
            const joinedDate = member ? member.joinedAt : 'N/A';

            const userInfo = `
\`\`\`asciidoc
= User Information =

[User]
• Tag      :: ${user.tag}
• ID       :: ${user.id}
• Created  :: ${creationDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

[Member]
• Nickname :: ${member?.nickname || 'None'}
• Joined   :: ${joinedDate !== 'N/A' ? joinedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
• Roles    :: ${roles}

[Avatar]
• URL      :: ${user.displayAvatarURL({ dynamic: true, size: 4096 })}
\`\`\`
            `;

            await message.edit(userInfo);

        } catch (error) {
            console.error("UserInfo error:", error);
            await message.edit('An error occurred while fetching user information.').catch(() => {});
        }
    }
};