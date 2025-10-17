const { delay, downloadAsset } = require('../../utils/cloneUtils');

module.exports = {
    name: "cloneemoji",
    description: "Clones all emojis from a server. Uses a proven logic.",
    aliases: ['copyemoji'],
    cooldown: 120,
    async execute(client, message, args) {
        const sourceGuildId = args[0];
        const targetGuildId = args[1];

        if (!sourceGuildId || !targetGuildId) {
            return message.edit(`**Usage:** \`${process.env.PREFIX}cloneemoji <source_id> <target_id>\``).catch(() => {});
        }

        const sourceGuild = client.guilds.cache.get(sourceGuildId);
        const targetGuild = client.guilds.cache.get(targetGuildId);

        if (!sourceGuild) return message.edit(`❌ **Error:** Source server not found.`).catch(() => {});
        if (!targetGuild) return message.edit(`❌ **Error:** Target server not found.`).catch(() => {});
        
        const emojis = [...sourceGuild.emojis.cache.values()];
        if (emojis.length === 0) return message.edit('❕ Tidak ada emoji untuk di-clone.');

        let success = 0;
        let failed = 0;

        for (let i = 0; i < emojis.length; i++) {
            const emoji = emojis[i];
            await message.edit(`\`\`\`😀 Cloning Emojis... [${i + 1}/${emojis.length}]\nNama: ${emoji.name}\`\`\``);
            try {
                const asset = await downloadAsset(emoji.url);
                await targetGuild.emojis.create(asset, emoji.name);
                success++;
                await delay(2000); // Jeda aman untuk emoji
            } catch (e) {
                failed++;
                console.log(`Gagal clone emoji: ${emoji.name} | ${e.message}`);
                await delay(3000); // Jeda lebih lama jika gagal
            }
        }

        await message.edit(`✅ **Clone Emoji Selesai!**\n\`\`\`- Sukses: ${success}\n- Gagal : ${failed}\`\`\``);
    }
};