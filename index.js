require('dotenv').config();
require('libsodium-wrappers');
require('opusscript');

const { Client, Collection } = require('discord.js-selfbot-v13');
const { loadCommands } = require('./src/handler/command_handler');
const { loadEvents } = require('./src/handler/event_handler');

const client = new Client({
    checkUpdate: false,
});

client.commands = new Collection();
client.aliases = new Collection();
client.cooldowns = new Collection();

loadCommands(client);
loadEvents(client);

client.login(process.env.TOKEN);