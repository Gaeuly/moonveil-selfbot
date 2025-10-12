module.exports = {
    name: 'servericon',
    description: 'Displays the current server\'s icon.',
    aliases: ['guildicon', 'sicon'],
    cooldown: 5,
    async execute(client, message, args) {
        if (!message.guild) {
            return message.edit('This command can only be used in a server.').catch(() => {});
        }

        const iconURL = message.guild.iconURL({ dynamic: true, size: 4096 });

        if (!iconURL) {
            return message.edit('This server does not have an icon.').catch(() => {});
        }

        await message.edit(iconURL).catch(() => {});
    }
};