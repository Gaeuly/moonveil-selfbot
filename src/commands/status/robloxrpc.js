const { RichPresence } = require('discord.js-selfbot-v13');
const axios = require('axios');

let rpcStartTime = null;

async function findRobloxGame(query) {
    if (!query) return null;
    try {
        const searchUrl = `https://apis.roblox.com/games/v1/games?keyword=${encodeURIComponent(query)}&limit=10`;
        const searchResponse = await axios.get(searchUrl);

        if (!searchResponse.data || !searchResponse.data.data || searchResponse.data.data.length === 0) {
            return null;
        }

        const game = searchResponse.data.data[0];
        const universeId = game.id;

        const iconUrl = `https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeId}&size=256x256&format=Png&isCircular=false`;
        const iconResponse = await axios.get(iconUrl);
        const icon = iconResponse.data.data[0]?.imageUrl;

        return {
            name: game.name,
            icon: icon || null
        };
    } catch (error) {
        console.error("Failed to fetch data from Roblox API:", error.message);
        return null;
    }
}

module.exports = {
    name: 'roblox',
    description: 'Displays a dynamic "Playing Roblox" status with real game data.',
    aliases: ['playroblox', 'robloxstatus'],
    cooldown: 15,
    async execute(client, message, args) {
        const subCommand = args[0] ? args[0].toLowerCase() : 'help';
        const prefix = process.env.PREFIX || '!';

        switch (subCommand) {
            case 'start':
                const gameQuery = args.slice(1).join(' ');
                if (!gameQuery) {
                    return message.edit(`**Invalid Usage!**\nPlease provide a game name to search for.\n\n**Example:** \`${prefix}roblox-rpc start Blox Fruits\``);
                }

                await message.edit(`🔍 Searching for Roblox game: "${gameQuery}"...`);

                const gameData = await findRobloxGame(gameQuery);

                if (!gameData) {
                    return message.edit(`❌ Could not find a Roblox game named **"${gameQuery}"**.`);
                }

                rpcStartTime = new Date();

                const rpc = new RichPresence(client)
                    .setApplicationId('383155383422451712')
                    .setType('PLAYING')
                    .setName('Roblox')
                    .setDetails(gameData.name)
                    .setState('In-Game')
                    .setAssetsLargeImage('https://cdn.discordapp.com/app-assets/383155383422451712/5935742542451712.png')
                    .setAssetsLargeText('Playing Roblox')
                    .setStartTimestamp(rpcStartTime);

                if (gameData.icon) {
                    rpc.setAssetsSmallImage(gameData.icon);
                    rpc.setAssetsSmallText(gameData.name);
                }

                client.user.setActivity(rpc);
                await message.edit(`RPC status set to **Playing ${gameData.name}** on Roblox!`);
                break;

            case 'stop':
                if (!rpcStartTime) {
                    return message.edit('Roblox RPC is not currently active.');
                }
                client.user.setActivity(null);
                rpcStartTime = null;
                await message.edit('Roblox RPC status has been stopped.');
                break;

            default:
                await message.edit(
                    `**Dynamic Roblox RPC Command**\n\n` +
                    `Fetches real game data from Roblox to create an authentic presence.\n\n` +
                    `**Commands:**\n` +
                    `\`${prefix}roblox-rpc start <game name>\`\n*Example: ${prefix}roblox-rpc start Adopt Me!*\n\n` +
                    `\`${prefix}roblox-rpc stop\`\n*Stops and clears the RPC status.*`
                );
                break;
        }
    }
};