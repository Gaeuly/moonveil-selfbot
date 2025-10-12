module.exports = {
    name: 'addy',
    description: 'Displays your configured Litecoin (LTC) wallet address.',
    aliases: ['ltc'],
    async execute(client, message, args) {
        const ltcAddress = 'ltc1qw9fqzcgtm4ak9m30n6lq6wlaykylq0fy0wcx5s'; // Ganti dengan alamat LTC Anda

        const addressMessage = `**🔒 My Litecoin (LTC) Wallet Address:**\n||${ltcAddress}||`;

        await message.edit(addressMessage).catch(() => {});
    }
};