const { joinVoiceChannel } = require('@discordjs/voice');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '..', 'data', 'vc_config.json');

const joinSavedVC = (client) => {
    if (fs.existsSync(configPath)) {
        try {
            const vcConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            if (vcConfig.guildId && vcConfig.channelId) {
                const guild = client.guilds.cache.get(vcConfig.guildId);
                if (!guild) return;

                joinVoiceChannel({
                    channelId: vcConfig.channelId,
                    guildId: guild.id,
                    adapterCreator: guild.voiceAdapterCreator,
                    selfDeaf: false,
                    selfMute: true,
                });
                console.log(`[24/7] Rejoined saved channel on startup.`);
            }
        } catch (error) {
            console.error('[24/7] Failed to rejoin VC on startup:', error);
        }
    }
};

module.exports = (client) => {
    console.log('------------------------------------');
    console.log(`Client is ready!`);
    console.log(`Logged in as: ${client.user.tag}`);
    console.log(`User ID: ${client.user.id}`);
    console.log(`Prefix: ${process.env.PREFIX}`);
    console.log('------------------------------------');
    
    // Attempt to rejoin a saved voice channel
    joinSavedVC(client);
};