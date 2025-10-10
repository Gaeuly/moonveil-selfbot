const fs = require('fs');
const path = require('path');

function loadCommands(client) {
    const commandsDir = path.join(__dirname, '..', 'commands');
    
    fs.readdirSync(commandsDir).forEach(dir => {
        const commandFiles = fs.readdirSync(path.join(commandsDir, dir)).filter(file => file.endsWith('.js'));
        
        for (const file of commandFiles) {
            try {
                const command = require(path.join(commandsDir, dir, file));
                if (command.name) {
                    client.commands.set(command.name, command);
                    if (command.aliases && command.aliases.length > 0) {
                        command.aliases.forEach(alias => client.aliases.set(alias, command.name));
                    }
                }
            } catch (error) {
                console.error(`Failed to load command ${file}:`, error);
            }
        }
    });
    console.log('Handler: All commands loaded successfully.');
}

module.exports = { loadCommands };