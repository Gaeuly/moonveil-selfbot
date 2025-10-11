const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', '..', 'data');
const rulesFile = path.join(dataDir, 'autoreact_rules.json');

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

let autoReactRules = [];

function loadRules() {
    try {
        if (fs.existsSync(rulesFile)) {
            const data = fs.readFileSync(rulesFile, 'utf8');
            autoReactRules = JSON.parse(data);
        }
    } catch (error) {
        console.error('Error loading autoreact rules:', error);
        autoReactRules = [];
    }
}

function saveRules() {
    try {
        const data = JSON.stringify(autoReactRules, null, 2);
        fs.writeFileSync(rulesFile, data, 'utf8');
    } catch (error) {
        console.error('Error saving autoreact rules:', error);
    }
}

loadRules();

const helpMessage = `**AutoReact Command Help**
Automatically react to messages.

**Commands:**
- \`!autoreact add user <@user> <emoji>\`: Reacts to a user's messages.
- \`!autoreact add keyword <word> <emoji>\`: Reacts to messages containing a keyword.
- \`!autoreact list\`: Shows all active rules.
- \`!autoreact remove <rule_id>\`: Removes a rule by its ID.
- \`!autoreact clear\`: Removes all rules.`;

module.exports = {
    name: 'autoreact',
    description: 'Automatically reacts to messages from specific users or with keywords.',
    
    // This will be called from messageCreate event
    async check(client, message) {
        if (!message.author || message.author.id === client.user.id) return;
        
        for (const rule of autoReactRules) {
            let shouldReact = false;
            
            if (rule.type === 'user' && message.author.id === rule.target) {
                shouldReact = true;
            } else if (rule.type === 'keyword' && message.content.toLowerCase().includes(rule.target.toLowerCase())) {
                shouldReact = true;
            }
            
            if (shouldReact) {
                try {
                    await message.react(rule.emoji);
                } catch (error) {
                    // console.error(`Failed to autoreact with ${rule.emoji}`);
                }
            }
        }
    },
    
    async execute(client, message, args) {
        const subCommand = args[0] ? args[0].toLowerCase() : '';

        if (!subCommand) {
            return message.edit(helpMessage).catch(() => {});
        }

        if (subCommand === 'add') {
            const type = args[1]?.toLowerCase();
            const target = args[2];
            const emoji = args[3];

            if (!type || !target || !emoji || (type !== 'user' && type !== 'keyword')) {
                return message.edit('Invalid format. Use: `!autoreact add <user/keyword> <target> <emoji>`').catch(() => {});
            }

            let targetId = target;
            if (type === 'user') {
                targetId = target.replace(/[<@!>]/g, '');
            }

            const newRule = {
                id: Date.now().toString(),
                type: type,
                target: targetId,
                emoji: emoji,
            };

            autoReactRules.push(newRule);
            saveRules();
            
            const targetDisplay = type === 'user' ? `<@${targetId}>` : `"${targetId}"`;
            await message.edit(`✅ Rule added! Will react with ${emoji} to ${type} ${targetDisplay}.`).catch(() => {});
        } 
        else if (subCommand === 'list') {
            if (autoReactRules.length === 0) {
                return message.edit('No autoreact rules are set.').catch(() => {});
            }
            const rulesList = autoReactRules.map(rule => {
                const targetDisplay = rule.type === 'user' ? `<@${rule.target}>` : `"${rule.target}"`;
                return `> **ID:** ${rule.id} | React with ${rule.emoji} to **${rule.type}** ${targetDisplay}`;
            }).join('\n');
            await message.edit(`**Active Autoreact Rules:**\n${rulesList}`).catch(() => {});
        } 
        else if (subCommand === 'remove') {
            const idToRemove = args[1];
            if (!idToRemove) {
                return message.edit('Please provide a rule ID to remove.').catch(() => {});
            }

            const initialLength = autoReactRules.length;
            autoReactRules = autoReactRules.filter(rule => rule.id !== idToRemove);

            if (autoReactRules.length === initialLength) {
                return message.edit('Rule not found with that ID.').catch(() => {});
            }
            
            saveRules();
            await message.edit('✅ Rule removed successfully.').catch(() => {});
        } 
        else if (subCommand === 'clear') {
            autoReactRules = [];
            saveRules();
            await message.edit('✅ All autoreact rules have been cleared.').catch(() => {});
        } else {
            return message.edit(helpMessage).catch(() => {});
        }
    }
};