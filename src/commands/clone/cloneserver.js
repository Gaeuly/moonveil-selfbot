const { delay } = require('../../utils/cloneUtils');

module.exports = {
    name: "cloneserver",
    description: "Clones a server's structure (roles, categories, channels).",
    aliases: ['copyserver'],
    cooldown: 120,
    async execute(client, message, args) {
        const sourceGuildId = args[0];
        const targetGuildId = args[1];

        if (!sourceGuildId || !targetGuildId) {
            return message.edit(`**Usage:** \`${process.env.PREFIX}cloneserver <source_id> <target_id>\``).catch(() => {});
        }

        const sourceGuild = client.guilds.cache.get(sourceGuildId);
        const targetGuild = client.guilds.cache.get(targetGuildId);

        if (!sourceGuild) return message.edit(`❌ **Error:** Source server not found.`).catch(() => {});
        if (!targetGuild) return message.edit(`❌ **Error:** Target server not found.`).catch(() => {});

        try {
            await message.edit(`**⚠️ WARNING!**\nThis will **DELETE ALL** channels & roles in **${targetGuild.name}**. Continue? (yes/no)`);
            const filter = m => m.author.id === client.user.id && ['yes', 'y'].includes(m.content.toLowerCase());
            const confirmation = await message.channel.awaitMessages({ filter, max: 1, time: 20000, errors: ['time'] });
            await confirmation.first().delete().catch(() => {});
        } catch (e) {
            return message.edit('❓ Operation cancelled due to no response.');
        }

        const roleMapping = new Map();
        const categoryMapping = new Map();
        let stats = { roles: 0, categories: 0, channels: 0, failed: 0 };

        await message.edit('`[1/5]` 🗑️ **Deleting all channels...**');
        for (const channel of targetGuild.channels.cache.values()) {
            await channel.delete().catch(() => {});
            await delay(350);
        }

        await message.edit('`[2/5]` 🗑️ **Deleting all roles...**');
        for (const role of targetGuild.roles.cache.values()) {
            if (role.editable) {
                await role.delete().catch(() => {});
                await delay(350);
            }
        }

        await message.edit('`[3/5]` 👑 **Cloning roles...**');
        const sourceRoles = [...sourceGuild.roles.cache.values()].filter(r => r.name !== '@everyone').sort((a, b) => b.position - a.position);
        for (const role of sourceRoles) {
            try {
                const newRole = await targetGuild.roles.create({
                    name: role.name, color: role.hexColor, permissions: role.permissions,
                    hoist: role.hoist, mentionable: role.mentionable,
                });
                roleMapping.set(role.id, newRole.id);
                stats.roles++;
            } catch (e) {
                console.log(`Failed to clone role: ${role.name}`);
                stats.failed++;
            }
            await delay(400);
        }
        
        await message.edit('`[4/5]` 📁 **Cloning categories & channels...**');
        const sourceChannels = [...sourceGuild.channels.cache.values()].sort((a, b) => a.position - b.position);
        
        for (const channel of sourceChannels.filter(c => c.type === 'GUILD_CATEGORY')) {
            try {
                const newCategory = await targetGuild.channels.create(channel.name, { type: 'GUILD_CATEGORY', position: channel.position });
                categoryMapping.set(channel.id, newCategory.id);
                stats.categories++;
            } catch (e) {
                console.log(`Failed to clone category: ${channel.name}`);
                stats.failed++;
            }
            await delay(400);
        }

        for (const channel of sourceChannels.filter(c => c.type !== 'GUILD_CATEGORY')) {
            try {
                const parentId = channel.parentId ? categoryMapping.get(channel.parentId) : null;
                const perms = [...channel.permissionOverwrites.cache.values()].map(p => {
                    const targetId = p.type === 'role' ? roleMapping.get(p.id) : p.id;
                    if (!targetId) return null;
                    return { id: targetId, allow: p.allow.toArray(), deny: p.deny.toArray() };
                }).filter(Boolean);

                if (channel.type === 'GUILD_TEXT' || channel.type === 'GUILD_VOICE') {
                    await targetGuild.channels.create(channel.name, {
                        type: channel.type, parent: parentId, permissionOverwrites: perms, topic: channel.topic,
                        nsfw: channel.nsfw, rateLimitPerUser: channel.rateLimitPerUser, bitrate: channel.bitrate, userLimit: channel.userLimit
                    });
                    stats.channels++;
                }
            } catch (e) {
                console.log(`Failed to clone channel: ${channel.name}`);
                stats.failed++;
            }
            await delay(400);
        }

        await message.edit('`[5/5]` ⚙️ **Finalizing server info...**');
        try {
            await targetGuild.setName(sourceGuild.name);
            if (sourceGuild.iconURL()) await targetGuild.setIcon(sourceGuild.iconURL({ dynamic: true, size: 1024 }));
        } catch(e) { console.log('Failed to set server info.'); }
        
        await message.edit(`✅ **Server Clone Complete!**\n` + `\`\`\`- Roles: ${stats.roles}\n- Categories: ${stats.categories}\n- Channels: ${stats.channels}\n- Failed: ${stats.failed}\`\`\``);
    }
};