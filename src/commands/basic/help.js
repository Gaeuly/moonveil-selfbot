const fs = require('fs');
const path = require('path');

const commandsDir = path.join(__dirname, '..', '..', 'commands');
let commandCategories = {};

function cacheCommandCategories(client) {
    const categories = {};
    try {
        const categoryFolders = fs.readdirSync(commandsDir)
            .filter(file => fs.statSync(path.join(commandsDir, file)).isDirectory());

        for (const folder of categoryFolders) {
            categories[folder] = [];
            const commandFiles = fs.readdirSync(path.join(commandsDir, folder))
                .filter(file => file.endsWith('.js'));
            
            for (const file of commandFiles) {
                const command = require(path.join(commandsDir, folder, file));
                if (command.name) {
                    categories[folder].push(command);
                }
            }
        }
        commandCategories = categories;
    } catch (error) {
        console.error("Failed to build command categories:", error);
        // Fallback if directory reading fails
        client.commands.forEach(cmd => {
            if (!categories['utility']) categories['utility'] = [];
            categories['utility'].push(cmd);
        });
        commandCategories = categories;
    }
}


module.exports = {
    name: 'help',
    description: 'Displays a list of available commands, or info about a specific command.',
    aliases: ['h', 'commands'],
    cooldown: 3,
    execute(client, message, args) {
        // Cache categories every time help is called to ensure it's up to date
        cacheCommandCategories(client);
        
        const prefix = process.env.PREFIX;
        const { commands } = client;

        if (!args.length) {
            let helpMessage = `**Veilcy Selfbot Command List**\n\n`;
            helpMessage += `You can use \`${prefix}help [category name]\` to get commands in a specific category.\n\n`;

            for (const category in commandCategories) {
                const commandList = commandCategories[category].map(cmd => `\`${cmd.name}\``).join(', ');
                helpMessage += `**${category.charAt(0).toUpperCase() + category.slice(1)}**\n${commandList}\n\n`;
            }
            
            return message.edit(helpMessage).catch(console.error);
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
        const categoryCommands = commandCategories[name];

        if (command) {
            let commandHelp = `**Command:** \`${command.name}\`\n\n`;
            if (command.aliases) commandHelp += `**Aliases:** ${command.aliases.join(', ')}\n`;
            if (command.description) commandHelp += `**Description:** ${command.description}\n`;
            if (command.cooldown) commandHelp += `**Cooldown:** ${command.cooldown} second(s)\n`;

            return message.edit(commandHelp).catch(console.error);
        }
        
        if (categoryCommands) {
            let categoryHelp = `**Category: ${name.charAt(0).toUpperCase() + name.slice(1)}**\n\n`;
            categoryCommands.forEach(cmd => {
                categoryHelp += `\`${prefix}${cmd.name}\` - ${cmd.description || 'No description'}\n`;
            });

            return message.edit(categoryHelp).catch(console.error);
        }

        return message.edit(`'${name}' is not a valid command or category.`).catch(console.error);
    }
};