const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'backup',
    description: 'Exports the guild channels and roles to a JSON file.',
    aliases: ['backup-channels'],
    async execute(client, message, args) {
        if (!message.guild) {
            return message.edit('This command can only be used in a server.').catch(() => {});
        }

        try {
            await message.edit('Starting server backup... Please wait.').catch(() => {});
            const guild = message.guild;

            // Backup roles
            const roles = guild.roles.cache
                .sort((a, b) => b.position - a.position)
                .map(r => ({
                    name: r.name,
                    color: r.hexColor,
                    hoist: r.hoist,
                    permissions: r.permissions.toArray(),
                    mentionable: r.mentionable
                }));

            // Backup channels
            const channels = guild.channels.cache
                .sort((a, b) => a.position - a.position)
                .map(ch => ({
                    name: ch.name,
                    type: ch.type,
                    topic: ch.topic || null,
                    nsfw: ch.nsfw,
                    parentId: ch.parentId,
                    position: ch.position,
                }));

            const backupData = {
                guildName: guild.name,
                guildId: guild.id,
                backupTimestamp: new Date().toISOString(),
                roles: roles,
                channels: channels
            };
            
            const backupDir = path.join(__dirname, '..', '..', '..', 'backups');
            if (!fs.existsSync(backupDir)) {
                fs.mkdirSync(backupDir, { recursive: true });
            }

            const filePath = path.join(backupDir, `backup-${guild.id}-${Date.now()}.json`);
            fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2), 'utf8');

            await message.edit(`✅ Server backup created successfully! File saved at: \`${filePath}\``).catch(() => {});

        } catch (error) {
            console.error('Backup error:', error);
            await message.edit('Failed to create server backup.').catch(() => {});
        }
    }
};