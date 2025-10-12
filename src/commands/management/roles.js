const { Permissions } = require('discord.js-selfbot-v13');

module.exports = {
    name: 'roles',
    description: 'Analyze role distribution and permission usage in the server.',
    aliases: ['roleinfo'],
    cooldown: 60,
    async execute(client, message, args) {
        if (!message.guild) {
            return message.edit('This command can only be used in a server.').catch(() => {});
        }

        await message.edit('🛡️ Analyzing server roles...').catch(() => {});

        const guild = message.guild;
        const roles = guild.roles.cache;
        const members = await guild.members.fetch();
        
        const roleDistribution = roles
            .filter(role => role.name !== '@everyone')
            .map(role => ({
                name: role.name,
                count: role.members.size,
                percentage: ((role.members.size / members.size) * 100).toFixed(1)
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        const dangerousPermissions = [
            'ADMINISTRATOR', 'KICK_MEMBERS', 'BAN_MEMBERS', 
            'MANAGE_CHANNELS', 'MANAGE_GUILD', 'MANAGE_ROLES'
        ];
        const dangerousRoles = roles.filter(role => 
            dangerousPermissions.some(perm => role.permissions.has(Permissions.FLAGS[perm]))
        );

        let report = `**🛡️ Role & Permission Analysis for ${guild.name}**\n\n`;
        report += '**📊 Top 10 Roles by Member Count:**\n';
        report += roleDistribution.map(r => `> **${r.name}**: ${r.count} members (${r.percentage}%)`).join('\n');
        report += '\n\n';

        report += `**⚠️ Roles with Dangerous Permissions (${dangerousRoles.size}):**\n`;
        report += dangerousRoles.map(r => `> ${r.name}`).slice(0, 10).join('\n');
        if (dangerousRoles.size > 10) report += `\n> ...and ${dangerousRoles.size - 10} more.`;

        await message.edit(report).catch(console.error);
    }
};