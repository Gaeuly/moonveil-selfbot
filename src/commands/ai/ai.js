const { toggleAI, setPrompt } = require('../../handler/aiHandler');

module.exports = {
    name: "ai",
    description: "Controls the AI auto-reply functionality.",
    aliases: ['bot'],
    cooldown: 5,
    async execute(client, message, args) {
        const subCommand = args[0] ? args[0].toLowerCase() : 'status';
        const prefix = process.env.PREFIX;

        switch (subCommand) {
            case 'on':
                toggleAI(true);
                await message.edit("✅ AI auto-reply has been **enabled**.").catch(() => {});
                break;

            case 'off':
                toggleAI(false);
                await message.edit("❌ AI auto-reply has been **disabled**.").catch(() => {});
                break;

            case 'prompt':
                const newPrompt = args.slice(1).join(' ');
                if (!newPrompt) {
                    return message.edit(`Please provide a new system prompt. Usage: \`${prefix}ai prompt <your prompt here>\``).catch(() => {});
                }
                setPrompt(newPrompt);
                await message.edit(`✅ AI system prompt has been updated.`).catch(() => {});
                break;
            
            default:
                 await message.edit(
                    `**AI Control Command**\n\n` +
                    `**Usage:**\n` +
                    `\`${prefix}ai on\` - Enables the AI auto-reply.\n` +
                    `\`${prefix}ai off\` - Disables the AI auto-reply.\n` +
                    `\`${prefix}ai prompt <text>\` - Sets a new system prompt for the AI.`
                ).catch(() => {});
                break;
        }
    }
};