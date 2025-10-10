const { RichPresence } = require('discord.js-selfbot-v13');

let statusInterval = null;
let rpcStartTime = null;

const statuses = {
    'respect': {
        details: 'Self Respect',
        state: 'Chapter 1',
        largeImage: 'https://cdn.discordapp.com/attachments/1218882306475950204/1233074089778876467/pngimg.com_-_number1_PNG14889.png?ex=662bc53c&is=662a73bc&hm=fafb310a8226b5afe86286ae5959e3bb23287f9291793973c969c46296416d85&',
        largeText: 'Priority One',
    },
    'improve': {
        details: 'Self Improvement',
        state: 'Chapter 2',
        largeImage: 'https://cdn.discordapp.com/attachments/1218882306475950204/1233074090244440094/number-2-tm-photo-16.png?ex=662bc53c&is=662a73bc&hm=931e899b927203b1cf52080c872de42217ddd1543b8e051322b0db09fa16d74f&',
        largeText: 'Daily Grind',
    },
    'diet': {
        details: 'Proper Diet',
        state: 'Chapter 3',
        largeImage: 'https://cdn.discordapp.com/attachments/1218882306475950204/1233074090647224340/images_1.png?ex=662bc53c&is=662a73bc&hm=c4d084292296c819f07b9151af8533490849086838032573f7ac7c2f5dff1a15&',
        largeText: 'Healthy Life',
    },
    'afk': {
        details: 'Currently Away',
        state: 'brb in a bit',
        largeImage: 'https://cdn.discordapp.com/avatars/1210993586187796510/a_adfe2482217fe513c7000a3f77b79bc1.gif?size=1024',
        largeText: 'AFK',
    }
};

const setPresence = (client, statusConfig, type = 'PLAYING') => {
    if (!client || !statusConfig) return;

    const rpc = new RichPresence(client)
        .setType(type.toUpperCase())
        .setURL('https://www.twitch.tv/veilcy')
        .setName('Veilcy Selfbot')
        .setDetails(statusConfig.details)
        .setState(statusConfig.state)
        .setAssetsLargeImage(statusConfig.largeImage)
        .setAssetsLargeText(statusConfig.largeText)
        .addButton('Source Code', 'https://github.com/your-repo')
        .addButton('Discord', 'https://discord.gg/your-server');

    if (rpcStartTime) {
        rpc.setStartTimestamp(rpcStartTime);
    }

    client.user.setActivity(rpc);
};

module.exports = {
    name: 'status',
    description: 'Sets a custom Rich Presence status with a selectable type.',
    aliases: ['rpc', 'setstatus'],
    cooldown: 10,
    async execute(client, message, args) {
        const subCommand = args[0] ? args[0].toLowerCase() : 'help';
        const prefix = process.env.PREFIX;
        const validTypes = ['PLAYING', 'STREAMING', 'LISTENING', 'WATCHING', 'COMPETING'];

        switch (subCommand) {
            case 'set':
                const typeToSet = args[1] ? args[1].toUpperCase() : null;
                const statusName = args[2];

                if (!typeToSet || !validTypes.includes(typeToSet)) {
                    return message.edit(`Invalid activity type. Use one of: \`${validTypes.join(', ').toLowerCase()}\`.`);
                }
                if (!statusName || !statuses[statusName]) {
                    return message.edit(`Status not found. Use \`${prefix}status list\` to see available statuses.`);
                }
                
                if (statusInterval) {
                    clearInterval(statusInterval);
                    statusInterval = null;
                }
                
                rpcStartTime = Date.now();
                setPresence(client, statuses[statusName], typeToSet);
                await message.edit(`RPC status set to **${typeToSet.toLowerCase()} ${statusName}**.`);
                break;

            case 'loop':
                const typeToLoop = args[1] ? args[1].toUpperCase() : null;

                if (!typeToLoop || !validTypes.includes(typeToLoop)) {
                    return message.edit(`Please specify a type for the loop. Use one of: \`${validTypes.join(', ').toLowerCase()}\`.`);
                }
                if (statusInterval) {
                    return message.edit('Status loop is already running.');
                }
                
                const statusKeys = Object.keys(statuses);
                let currentIndex = 0;

                rpcStartTime = Date.now();
                setPresence(client, statuses[statusKeys[currentIndex]], typeToLoop);
                
                statusInterval = setInterval(() => {
                    currentIndex = (currentIndex + 1) % statusKeys.length;
                    setPresence(client, statuses[statusKeys[currentIndex]], typeToLoop);
                }, 15000);

                await message.edit(`Status loop started with type **${typeToLoop.toLowerCase()}**.`);
                break;

            case 'stop':
                if (statusInterval) {
                    clearInterval(statusInterval);
                    statusInterval = null;
                }
                rpcStartTime = null;
                client.user.setActivity(null);
                await message.edit('RPC status has been stopped and cleared.');
                break;
                
            case 'list':
                const availableStatuses = Object.keys(statuses).join(', ');
                await message.edit(`Available statuses: \`${availableStatuses}\``);
                break;

            default:
                await message.edit(
                    `**Flexible RPC Status Command**\n\n` +
                    `**Usage:**\n` +
                    `\`${prefix}status set <type> <name>\`\n` +
                    `\`${prefix}status loop <type>\`\n` +
                    `\`${prefix}status stop\`\n` +
                    `\`${prefix}status list\`\n\n` +
                    `**Available Types:** \`playing, streaming, listening, watching, competing\``
                );
                break;
        }
    }
};