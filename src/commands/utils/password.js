module.exports = {
    name: 'password',
    description: 'Generate a secure random password.',
    aliases: ['pass', 'pw'],
    async execute(client, message, args) {
        const length = parseInt(args[0]) || 16;
        if (length < 8 || length > 128) {
            return message.edit('Password length must be between 8 and 128 characters.').catch(() => {});
        }

        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
        let password = '';
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }

        try {
            await message.channel.send(`**🔒 Generated Password:**\n||${password}||`);
            await message.delete().catch(() => {});
        } catch (error) {
            console.error(error);
        }
    }
};