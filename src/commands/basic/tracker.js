const fs = require('fs');
const path = require('path');

let isTrackingActive = false;
const trackedUsers = new Map();
const eventListeners = new Map();
const trackingDataPath = path.join(__dirname, '..', '..', '..', 'tracking_data.json');
const logsDir = path.join(__dirname, '..', '..', '..', 'logs');

function loadTrackingData() {
    if (fs.existsSync(trackingDataPath)) {
        try {
            const data = JSON.parse(fs.readFileSync(trackingDataPath, "utf8"));
            for (const [userId, userData] of Object.entries(data)) {
                trackedUsers.set(userId, userData);
            }
        } catch (err) {
            console.error("Error loading tracking data:", err);
        }
    }
}

function saveTrackingData() {
    try {
        if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
        const data = Object.fromEntries(trackedUsers);
        fs.writeFileSync(trackingDataPath, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Error saving tracking data:", err);
    }
}

function logActivity(userId, type, details) {
    const userData = trackedUsers.get(userId);
    if (!userData) return;

    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] [${type}] ${details}\n`;

    try {
        if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
        fs.appendFileSync(path.join(logsDir, userData.logFile), logLine);
    } catch (err) {
        console.error("Error writing to log file:", err);
    }
}

function setupEventListeners(client) {
    if (isTrackingActive) return;

    const messageCreateListener = (message) => {
        if (message.author && trackedUsers.has(message.author.id)) {
            logActivity(message.author.id, "MESSAGE", `[${message.guild?.name || 'DM'} | #${message.channel.name}] ${message.content}`);
        }
    };
    client.on('messageCreate', messageCreateListener);
    eventListeners.set('messageCreate', messageCreateListener);

    isTrackingActive = true;
}

function removeEventListeners(client) {
    if (!isTrackingActive) return;
    for (const [event, listener] of eventListeners) {
        client.removeListener(event, listener);
    }
    eventListeners.clear();
    isTrackingActive = false;
}

loadTrackingData();

module.exports = {
    name: "tracker",
    description: "Tracks user activities.",
    aliases: ['track'],
    cooldown: 5,
    async execute(client, message, args) {
        const subCommand = args[0]?.toLowerCase();
        const targetUserMention = message.mentions.users.first();
        const targetId = targetUserMention?.id || args[1];
        const prefix = process.env.PREFIX;

        if (trackedUsers.size > 0 && !isTrackingActive) setupEventListeners(client);
        if (trackedUsers.size === 0 && isTrackingActive) removeEventListeners(client);

        switch (subCommand) {
            case 'start':
                if (!targetId) return message.edit('Please mention a user or provide an ID to track.');
                if (trackedUsers.has(targetId)) return message.edit('This user is already being tracked.');

                const userToTrack = await client.users.fetch(targetId).catch(() => null);
                if (!userToTrack) return message.edit('User not found.');

                const logFile = `track_${userToTrack.username}_${targetId}.log`;
                trackedUsers.set(targetId, { tag: userToTrack.tag, logFile });
                saveTrackingData();
                if (!isTrackingActive) setupEventListeners(client);
                message.edit(`✅ Started tracking **${userToTrack.tag}**.`);
                break;

            case 'stop':
                if (!targetId) return message.edit('Please mention a user or provide an ID to stop tracking.');
                if (!trackedUsers.has(targetId)) return message.edit('This user is not being tracked.');

                const stoppedUser = trackedUsers.get(targetId);
                trackedUsers.delete(targetId);
                saveTrackingData();
                if (trackedUsers.size === 0) removeEventListeners(client);
                message.edit(`⏹️ Stopped tracking **${stoppedUser.tag}**.`);
                break;

            case 'list':
                if (trackedUsers.size === 0) return message.edit('No users are currently being tracked.');
                let list = '📝 **Tracked Users:**\n';
                trackedUsers.forEach((data, id) => {
                    list += `\n• \`${data.tag}\` (ID: ${id}) - Logging to \`${data.logFile}\``;
                });
                message.edit(list);
                break;

            default:
                message.edit(`**User Tracker**\n- \`${prefix}tracker start <@user|id>\`\n- \`${prefix}tracker stop <@user|id>\`\n- \`${prefix}tracker list\``);
                break;
        }
    }
};