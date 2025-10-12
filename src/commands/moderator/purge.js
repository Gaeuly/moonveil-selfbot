module.exports = {
    name: "purge",
    description: "Deletes a specified number of your own messages in the current channel.",
    aliases: ['clear'],
    cooldown: 10,
    async execute(client, message, args) {
        const amount = parseInt(args[0]);

        if (isNaN(amount) || amount <= 0) {
            return message.edit(`Please provide a number of messages to delete (1-100).`).catch(() => {});
        }

        if (amount > 100) {
            return message.edit("You can only delete a maximum of 100 messages at a time.").catch(() => {});
        }

        try {
            await message.delete().catch(() => {});

            const messages = await message.channel.messages.fetch({ limit: 100 });
            const userMessages = messages.filter(m => m.author.id === client.user.id);
            const messagesToDelete = Array.from(userMessages.values()).slice(0, amount);

            if (messagesToDelete.length === 0) {
                const reply = await message.channel.send("No recent messages from you found to delete.");
                setTimeout(() => reply.delete().catch(() => {}), 5000);
                return;
            }

            for (const msg of messagesToDelete) {
                await msg.delete();
                await new Promise(resolve => setTimeout(resolve, 350));
            }

            const confirmMsg = await message.channel.send(`✅ Successfully deleted ${messagesToDelete.length} of your messages.`);
            setTimeout(() => confirmMsg.delete().catch(() => {}), 5000);

        } catch (error) {
            console.error("Purge command error:", error);
            const errorMsg = await message.channel.send(`❌ An error occurred. I might be missing permissions in this channel.`);
            setTimeout(() => errorMsg.delete().catch(() => {}), 5000);
        }
    }
};