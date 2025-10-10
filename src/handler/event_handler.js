const fs = require('fs');
const path = require('path');

function loadEvents(client) {
    const eventsDir = path.join(__dirname, '..', 'events');
    const eventFiles = fs.readdirSync(eventsDir).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        try {
            const eventName = file.split('.')[0];
            const eventFunction = require(path.join(eventsDir, file));

            if (typeof eventFunction !== 'function') {
                console.error(`Error: Event file ${file} does not export a function.`);
                continue;
            }

            if (eventName === 'ready') {
                client.once(eventName, () => eventFunction(client));
            } else {
                client.on(eventName, (...args) => eventFunction(client, ...args));
            }
        } catch (error) {
            console.error(`Failed to load event ${file}:`, error);
        }
    }
    console.log('Handler: All events loaded successfully.');
}

module.exports = { loadEvents };