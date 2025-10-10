const {
    joinVoiceChannel,
    getVoiceConnection
} = require('@discordjs/voice');
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', '..', 'data');
const configPath = path.join(dataDir, 'vc_config.json');

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

const helpMessage = `**24/7 Voice Command Help**
Keeps the bot in a voice channel 24/7.

**Commands:**
- \`!247 on <channel_id>\`: Joins the specified voice channel.
- \`!247 off\`: Leaves the current voice channel.
- \`!247 status\`: Checks the current 24/7 status.`;

async function joinVC(client, message, channelId) {
    const channel = await client.channels.fetch(channelId).catch(() => null);

    if (!channel || channel.type !== 'GUILD_VOICE') {
        return message.edit('Error: Invalid Channel ID or I cannot access it.').catch(() => {});
    }

    try {
        joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
            selfDeaf: false,
            selfMute: true,
        });

        const config = { guildId: channel.guild.id, channelId: channel.id };
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

        await message.edit(`Successfully joined **${channel.name}** for 24/7.`).catch(() => {});

    } catch (error) {
        console.error("Failed to join voice channel:", error);
        await message.edit(`Failed to join. Error: ${error.message}`).catch(() => {});
    }
}

module.exports = {
    name: '247',
    description: 'Keeps the bot in a voice channel 24/7.',
    aliases: ['afkvc', 'vc'],
    async execute(client, message, args) {
        const subCommand = args[0] ? args[0].toLowerCase() : '';

        if (!subCommand) {
            return message.edit(helpMessage).catch(() => {});
        }

        if (subCommand === 'on') {
            const channelId = args[1];
            if (!channelId) {
                return message.edit('Usage: `!247 on <channel_id>`').catch(() => {});
            }
            await joinVC(client, message, channelId);
        } else if (subCommand === 'off') {
            const guildId = message.guild?.id;
            if (!guildId) return;
            
            const connection = getVoiceConnection(guildId);
            if (connection) {
                connection.destroy();
                if (fs.existsSync(configPath)) {
                    fs.unlinkSync(configPath);
                }
                await message.edit('Left the voice channel and cleared 24/7 status.').catch(() => {});
            } else {
                await message.edit('I am not in a voice channel.').catch(() => {});
            }
        } else if (subCommand === 'status') {
            if (fs.existsSync(configPath)) {
                const vcConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                await message.edit(`24/7 is configured for channel ID \`${vcConfig.channelId}\`.`).catch(() => {});
            } else {
                await message.edit('24/7 status is not configured.').catch(() => {});
            }
        } else {
            return message.edit(helpMessage).catch(() => {});
        }
    }
};