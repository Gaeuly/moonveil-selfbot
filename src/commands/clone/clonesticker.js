const { delay } = require('../../utils/cloneUtils');

module.exports = {
    name: "clonesticker",
    description: "Clones all stickers from a server using the direct URL method.",
    aliases: ['copysticker'],
    cooldown: 120,
    async execute(client, message, args) {
        const sourceGuildId = args[0];
        const targetGuildId = args[1];

        if (!sourceGuildId || !targetGuildId) {
            return message.edit(`**Usage:** \`${process.env.PREFIX}clonesticker <source_id> <target_id>\``).catch(() => {});
        }

        const sourceGuild = client.guilds.cache.get(sourceGuildId);
        const targetGuild = client.guilds.cache.get(targetGuildId);

        if (!sourceGuild) return message.edit(`❌ **Error:** Source server not found.`).catch(() => {});
        if (!targetGuild) return message.edit(`❌ **Error:** Target server not found.`).catch(() => {});
        
        // We try to clone all available stickers, letting Discord's API handle the format.
        const stickersToClone = [...sourceGuild.stickers.cache.values()].filter(s => s.available);
        if (stickersToClone.length === 0) return message.edit('❕ No available stickers found to clone.');

        let success = 0;
        let failed = 0;

        for (let i = 0; i < stickersToClone.length; i++) {
            const sticker = stickersToClone[i];
            await message.edit(`\`\`\`🎨 Cloning Stickers... [${i + 1}/${stickersToClone.length}]\nName: ${sticker.name}\`\`\``);
            
            try {
                // --- STEALSTICKER LOGIC ---
                // We pass the direct URL to the 'file' property.
                // This lets Discord handle the download and validation.
                
                let emojiTag = '✨'; // Default tag
                if (sticker.tags && typeof sticker.tags === 'string' && sticker.tags.length > 0) {
                    emojiTag = sticker.tags.split(',')[0].trim();
                } else if (sticker.tags && Array.isArray(sticker.tags) && sticker.tags.length > 0) {
                    emojiTag = sticker.tags[0];
                }

                await targetGuild.stickers.create({
                    file: sticker.url,
                    name: sticker.name,
                    tags: emojiTag
                });
                
                success++;
                await delay(3000); // Rate limit is still important.
            } catch (e) {
                failed++;
                // This will likely fail for Lottie stickers, which is expected.
                console.log(`Failed to clone sticker (likely unsupported format like Lottie): ${sticker.name}`);
                await delay(1000); // Shorter delay on fail
            }
        }

        await message.edit(`✅ **Sticker Clone Complete!**\n\`\`\`- Success: ${success}\n- Failed : ${failed}\`\`\``);
    }
};