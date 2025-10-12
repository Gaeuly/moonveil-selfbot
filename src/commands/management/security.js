const { Permissions } = require('discord.js-selfbot-v13');

module.exports = {
    name: 'security',
    description: 'Performs a comprehensive security assessment of the server.',
    aliases: ['audit'],
    cooldown: 60,
    async execute(client, message, args) {
        if (!message.guild) {
            return message.edit('This command can only be used in a server.').catch(() => {});
        }

        await message.edit('🔒 Performing security audit...').catch(() => {});

        const guild = message.guild;
        const vulnerabilities = [];
        let securityScore = 100;

        if (guild.verificationLevel === 'NONE' || guild.verificationLevel === 'LOW') {
            vulnerabilities.push("Verification level is too low.");
            securityScore -= 15;
        }
        if (guild.mfaLevel === 'NONE') {
            vulnerabilities.push("2FA for moderation is not required.");
            securityScore -= 20;
        }
        if (guild.explicitContentFilter === 'DISABLED') {
            vulnerabilities.push("Explicit content filter is disabled.");
            securityScore -= 10;
        }

        const adminRoles = guild.roles.cache.filter(r => r.permissions.has(Permissions.FLAGS.ADMINISTRATOR) && r.name !== '@everyone');
        if (adminRoles.size > 3) {
            vulnerabilities.push(`High number of roles with Administrator permissions (${adminRoles.size}).`);
            securityScore -= (adminRoles.size * 2);
        }

        const securityLevel = securityScore >= 80 ? "EXCELLENT" : securityScore >= 60 ? "MODERATE" : "POOR";

        let report = `**🔒 Security Audit Report for ${guild.name}**\n\n`;
        report += `> **Overall Score**: ${securityScore}/100\n`;
        report += `> **Security Level**: ${securityLevel}\n\n`;
        report += `**⚠️ Identified Vulnerabilities (${vulnerabilities.length}):**\n`;
        report += vulnerabilities.length > 0 ? vulnerabilities.map(v => `> - ${v}`).join('\n') : '> - No critical vulnerabilities detected.';

        await message.edit(report).catch(console.error);
    }
};