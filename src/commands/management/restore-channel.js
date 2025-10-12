const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'restore',
    description: 'Restores channels and roles from a server backup file.',
    aliases: ['loadbackup'],
    cooldown: 300,
    async execute(client, message, args) {
        if (!message.guild) {
            return message.edit('This command can only be used in a server.').catch(() => {});
        }

        const fileName = args[0];
        if (!fileName) {
            return message.edit('Usage: `!restore <backup-file.json>`').catch(() => {});
        }

        const filePath = path.join(process.cwd(), 'backups', fileName);
        if (!fs.existsSync(filePath)) {
            return message.edit('Backup file not found in the `backups` directory.').catch(() => {});
        }

        try {
            const backupData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            const guild = message.guild;

            await message.edit(`- 復元 -
Starting restore from \`${fileName}\`. This will take a while. Do not interrupt the process.`).catch(() => {});

            // Restore Roles
            for (const roleData of backupData.roles.filter(r => r.name !== '@everyone').sort((a, b) => a.position - b.position)) {
                await guild.roles.create({
                    name: roleData.name,
                    color: roleData.color,
                    hoist: roleData.hoist,
                    permissions: BigInt(roleData.permissions),
                    mentionable: roleData.mentionable,
                    position: roleData.position,
                    reason: 'Restoring from backup.'
                }).catch(console.error);
                await new Promise(r => setTimeout(r, 500)); // Rate limit
            }

            // Restore Channels
            for (const channelData of backupData.channels) {
                const channelOptions = {
                    type: channelData.type === 4 ? 'GUILD_CATEGORY' : (channelData.type === 2 ? 'GUILD_VOICE' : 'GUILD_TEXT'),
                    topic: channelData.topic,
                    nsfw: channelData.nsfw,
                    position: channelData.position,
                    rateLimitPerUser: channelData.rateLimitPerUser,
                    bitrate: channelData.bitrate,
                    userLimit: channelData.userLimit,
                    parent: backupData.channels.find(c => c.id === channelData.parentId)?.name,
                    reason: 'Restoring from backup.'
                };
                await guild.channels.create(channelData.name, channelOptions).catch(console.error);
                await new Promise(r => setTimeout(r, 500)); // Rate limit
            }

            await message.edit(`✅ Restore complete from \`${fileName}\`. Please check the server structure. Some permissions might need manual adjustment.`).catch(() => {});

        } catch (error) {
            console.error(error);
            await message.edit('Failed to restore backup. The file might be corrupted or permissions are missing.').catch(() => {});
        }
    }
};