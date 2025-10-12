module.exports = {
    name: 'serverinfo',
    description: 'Displays detailed information about the current server.',
    aliases: ['sinfo', 'guildinfo'],
    cooldown: 10,
    async execute(client, message, args) {
        if (!message.guild) {
            return message.edit('This command can only be used in a server.').catch(() => {});
        }

        try {
            const guild = message.guild;
            const owner = await guild.fetchOwner();
            
            const textChannels = guild.channels.cache.filter(c => c.isText()).size;
            const voiceChannels = guild.channels.cache.filter(c => c.isVoice()).size;
            const categoryChannels = guild.channels.cache.filter(c => c.type === 'GUILD_CATEGORY').size;
            const memberCount = guild.memberCount;
            const onlineMembers = guild.presences.cache.filter(p => p.status !== 'offline').size;

            const serverInfo = `
\`\`\`asciidoc
= Server Information =

[Guild]
• Name     :: ${guild.name}
• ID       :: ${guild.id}
• Owner    :: ${owner.user.tag} (${owner.id})
• Created  :: ${guild.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

[Statistics]
• Members  :: ${memberCount} (${onlineMembers} online)
• Channels :: ${guild.channels.cache.size} (Text: ${textChannels}, Voice: ${voiceChannels}, Categories: ${categoryChannels})
• Roles    :: ${guild.roles.cache.size}
• Emojis   :: ${guild.emojis.cache.size}

[Boost Status]
• Level    :: ${guild.premiumTier}
• Boosts   :: ${guild.premiumSubscriptionCount || 0}
\`\`\`
            `;

            await message.edit(serverInfo);
        } catch (error) {
            console.error("ServerInfo error:", error);
            await message.edit('An error occurred while fetching server information.').catch(() => {});
        }
    }
};