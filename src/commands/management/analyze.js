module.exports = {
    name: 'analyze',
    description: 'Analyzes DMs or servers for detailed statistics.',
    aliases: ['analisis'],
    cooldown: 60,
    async execute(client, message, args) {
        const helpMessage = `**Analyze Command Help**
- \`!analyze\`: Analyzes the current server or DM.
- \`!analyze -msgs <number>\`: Sets a custom message limit (default: 1000).`;

        if (args.includes('-h') || args.includes('-help')) {
            return message.edit(helpMessage).catch(() => {});
        }

        let messageLimit = 1000;
        const msgsIndex = args.findIndex(arg => arg === '-m' || arg === '-msgs');
        if (msgsIndex !== -1 && args[msgsIndex + 1]) {
            const limit = parseInt(args[msgsIndex + 1]);
            if (!isNaN(limit) && limit > 0) {
                messageLimit = Math.min(limit, 10000); // Max limit of 10k
            }
        }

        const channel = message.channel;
        const isDM = !message.guild;

        if (isDM) {
            await analyzeDM(channel, messageLimit);
        } else {
            await analyzeServer(message.guild, channel);
        }

        // --- Helper Functions ---

        async function analyzeDM(dmChannel, limit) {
            const progressMsg = await dmChannel.send(`🔍 Starting DM analysis for the last ${limit} messages...`).catch(() => null);
            let userStats = {};
            let lastId = null;
            let fetchedMessages = 0;

            while (fetchedMessages < limit) {
                const options = { limit: Math.min(100, limit - fetchedMessages) };
                if (lastId) {
                    options.before = lastId;
                }
                const messages = await dmChannel.messages.fetch(options);
                if (messages.size === 0) break;

                messages.forEach(msg => {
                    const authorId = msg.author.id;
                    if (!userStats[authorId]) {
                        userStats[authorId] = {
                            username: msg.author.username,
                            messageCount: 0,
                            wordCount: 0,
                            charCount: 0,
                        };
                    }
                    userStats[authorId].messageCount++;
                    userStats[authorId].charCount += msg.content.length;
                    userStats[authorId].wordCount += msg.content.split(/\s+/).filter(Boolean).length;
                });

                fetchedMessages += messages.size;
                lastId = messages.lastKey();
                if (progressMsg) await progressMsg.edit(`🔍 Analyzing... ${fetchedMessages}/${limit} messages scanned.`).catch(() => {});
            }
            
            if (progressMsg) await progressMsg.delete().catch(() => {});

            let report = `**📊 DM Analysis Results (last ${fetchedMessages} messages):**\n\n`;
            const sortedUsers = Object.values(userStats).sort((a, b) => b.messageCount - a.messageCount);

            sortedUsers.forEach(stats => {
                report += `**${stats.username}**:
> **Messages**: ${stats.messageCount}
> **Words**: ${stats.wordCount}
> **Characters**: ${stats.charCount}\n\n`;
            });

            await dmChannel.send(report).catch(console.error);
        }

        async function analyzeServer(guild, responseChannel) {
            const owner = await guild.fetchOwner();
            const channels = guild.channels.cache;
            
            const serverInfo = `**🔌 Server Analytics Report for ${guild.name}**

**Basic Info:**
- **Owner**: ${owner.user.tag}
- **Created**: ${guild.createdAt.toDateString()}
- **Members**: ${guild.memberCount}

**Channel Stats:**
- **Total Channels**: ${channels.size}
- **Text Channels**: ${channels.filter(c => c.type === 'GUILD_TEXT').size}
- **Voice Channels**: ${channels.filter(c => c.type === 'GUILD_VOICE').size}
- **Categories**: ${channels.filter(c => c.type === 'GUILD_CATEGORY').size}

**Roles & Emojis:**
- **Total Roles**: ${guild.roles.cache.size}
- **Custom Emojis**: ${guild.emojis.cache.size}`;

            await responseChannel.send(serverInfo).catch(console.error);
        }
    }
};