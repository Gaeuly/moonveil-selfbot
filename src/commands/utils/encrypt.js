const crypto = require('crypto');

const caesarCipher = (text, shift) => {
    return text.split('').map(char => {
        if (char.match(/[a-z]/i)) {
            const code = char.charCodeAt(0);
            const base = code >= 65 && code <= 90 ? 65 : 97;
            return String.fromCharCode(((code - base + shift) % 26) + base);
        }
        return char;
    }).join('');
};

module.exports = {
    name: 'encrypt',
    description: 'Encrypts text using various algorithms.',
    aliases: ['cipher', 'encode'],
    cooldown: 5,
    async execute(client, message, args) {
        const algorithm = args[0] ? args[0].toLowerCase() : '';
        const text = args.slice(1).join(' ');

        const availableAlgorithms = ['base64', 'caesar'];
        
        if (!text || !availableAlgorithms.includes(algorithm)) {
            return message.edit(`**Encrypt Help**\nUsage: \`!encrypt <algorithm> <text>\`\n\nAvailable algorithms: ${availableAlgorithms.join(', ')}`).catch(() => {});
        }

        let result;
        let method;

        switch (algorithm) {
            case 'caesar':
                result = caesarCipher(text, 3); // Shift 3 karakter
                method = 'Caesar Cipher (shift 3)';
                break;
            case 'base64':
                result = Buffer.from(text).toString('base64');
                method = 'Base64 Encoding';
                break;
        }

        const response = `🔐 **Text Encryption**\n\n` +
                         `**Method:** ${method}\n` +
                         `**Original:** ${text.length > 100 ? text.substring(0, 100) + '...' : text}\n` +
                         `**Encrypted:** \`\`\`${result}\`\`\``;

        await message.edit(response).catch(() => {});
    }
};