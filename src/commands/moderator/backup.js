const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { promisify } = require('util');

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);
const backupDir = path.join(__dirname, '..', '..', '..', 'backups');

async function createBackup(guild) {
    const backupData = {
        name: guild.name,
        icon: guild.iconURL({ dynamic: true }),
        roles: [],
        channels: [],
    };

    guild.roles.cache.forEach(role => {
        if (role.name !== '@everyone') {
            backupData.roles.push({
                name: role.name,
                color: role.hexColor,
                hoist: role.hoist,
                permissions: role.permissions.toArray(),
                mentionable: role.mentionable,
            });
        }
    });

    guild.channels.cache.forEach(channel => {
        if (channel.type !== 'GUILD_CATEGORY') {
            backupData.channels.push({
                name: channel.name,
                type: channel.type,
                topic: channel.topic,
                nsfw: channel.nsfw,
                parent: channel.parent ? channel.parent.name : null,
                permissionOverwrites: channel.permissionOverwrites.cache.map(p => ({
                    id: p.id,
                    type: p.type,
                    allow: p.allow.toArray(),
                    deny: p.deny.toArray(),
                })),
            });
        }
    });

    return backupData;
}

function formatFileSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / 1048576).toFixed(2)} MB`;
}

module.exports = {
    name: 'backup',
    description: 'Manages server backups. Requires administrator permissions.',
    aliases: ['serverbackup'],
    cooldown: 60,
    async execute(client, message, args) {
        if (!message.guild) {
            return message.edit('This command can only be used in a server.');
        }

        const subCommand = args[0] ? args[0].toLowerCase() : 'help';
        const backupName = args[1];

        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        try {
            switch (subCommand) {
                case 'create':
                    if (!backupName) {
                        return message.edit('Please provide a name for the backup.');
                    }
                    await message.edit(`📦 Creating server backup named \`${backupName}\`...`);
                    const data = await createBackup(message.guild);
                    const compressed = await gzip(JSON.stringify(data, null, 2));
                    fs.writeFileSync(path.join(backupDir, `${backupName}.json.gz`), compressed);
                    await message.edit(`✅ Backup \`${backupName}\` created successfully.`);
                    break;

                case 'load':
                    if (!backupName) {
                        return message.edit('Please provide the name of the backup to load.');
                    }
                    const loadPath = path.join(backupDir, `${backupName}.json.gz`);
                    if (!fs.existsSync(loadPath)) {
                        return message.edit(`Backup \`${backupName}\` not found.`);
                    }

                    await message.edit(`🔄 Clearing server and loading backup \`${backupName}\`...`);

                    const backupContent = await gunzip(fs.readFileSync(loadPath));
                    const backupData = JSON.parse(backupContent.toString());

                    for (const channel of message.guild.channels.cache.values()) {
                        await channel.delete().catch(() => {});
                    }
                    for (const role of message.guild.roles.cache.values()) {
                        if (role.name !== '@everyone' && !role.managed) {
                            await role.delete().catch(() => {});
                        }
                    }

                    for (const roleData of backupData.roles.reverse()) {
                        await message.guild.roles.create({
                            name: roleData.name,
                            color: roleData.color,
                            hoist: roleData.hoist,
                            permissions: roleData.permissions,
                            mentionable: roleData.mentionable,
                        }).catch(console.error);
                    }
                    
                    for (const channelData of backupData.channels) {
                         const parent = backupData.channels.find(c => c.name === channelData.parent && c.type === 'GUILD_CATEGORY');
                         const parentChannel = parent ? message.guild.channels.cache.find(c => c.name === parent.name && c.type === 'GUILD_CATEGORY') : null;

                        await message.guild.channels.create(channelData.name, {
                            type: channelData.type,
                            topic: channelData.topic,
                            nsfw: channelData.nsfw,
                            parent: parentChannel,
                        }).catch(console.error);
                    }

                    await message.edit(`✅ Server restored successfully from backup \`${backupName}\`.`);
                    break;

                case 'list':
                    const files = fs.readdirSync(backupDir).filter(f => f.endsWith('.json.gz'));
                    if (files.length === 0) {
                        return message.edit('No backups found.');
                    }
                    let list = '📦 **Available Backups**\n\n';
                    files.forEach(file => {
                        const stats = fs.statSync(path.join(backupDir, file));
                        list += `• \`${file.replace('.json.gz', '')}\` (${formatFileSize(stats.size)})\n`;
                    });
                    await message.edit(list);
                    break;

                default:
                    const prefix = process.env.PREFIX;
                    await message.edit(
                        `**Server Backup System**\n\n` +
                        `\`${prefix}backup create <name>\` - Creates a backup of the server.\n` +
                        `\`${prefix}backup load <name>\` - Loads a backup (Deletes current server channels/roles).\n` +
                        `\`${prefix}backup list\` - Lists all available backups.`
                    );
                    break;
            }
        } catch (error) {
            console.error('Backup command error:', error);
            await message.edit('❌ An error occurred during the backup process. Check console for details.');
        }
    }
};