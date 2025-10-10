const { Collection } = require('discord.js-selfbot-v13');

module.exports = async (client, message) => {
    if (!client.user || !message || !message.author) return;

    if (message.author.id !== client.user.id) return;

    const prefix = process.env.PREFIX;
    if (!prefix || !message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.get(client.aliases.get(commandName));
    if (!command) return;

    if (!client.cooldowns.has(command.name)) {
        client.cooldowns.set(command.name, new Collection());
    }

    const now = Date.now();
    const timestamps = client.cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            try {
                const reply = await message.reply(`Please wait ${timeLeft.toFixed(1)}s before reusing \`${command.name}\`.`);
                setTimeout(() => reply.delete().catch(() => {}), 4000);
            } catch (e) { /* ignore */ }
            return;
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        await command.execute(client, message, args);
    } catch (error) {
        console.error(`Error executing command ${command.name}:`, error);
        try {
            await message.reply('There was an error trying to execute that command!');
        } catch (e) { /* ignore */ }
    }
};