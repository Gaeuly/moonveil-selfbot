const crypto = require('crypto');

const morseMap = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--',
    '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
    '9': '----.', '0': '-----', ' ': '/'
};
const reverseMorseMap = Object.fromEntries(Object.entries(morseMap).map(a => a.reverse()));

function rot13(text) {
    return text.split('').map(char => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) {
            return String.fromCharCode(((code - 65 + 13) % 26) + 65);
        } else if (code >= 97 && code <= 122) {
            return String.fromCharCode(((code - 97 + 13) % 26) + 97);
        }
        return char;
    }).join('');
}

module.exports = {
    name: 'encode',
    description: 'Encodes or decodes text using various methods.',
    aliases: ['enc', 'dec'],
    cooldown: 5,
    async execute(client, message, args) {
        const prefix = process.env.PREFIX;
        const method = args[0]?.toLowerCase();
        const operation = args[1]?.toLowerCase();
        const text = args.slice(2).join(' ');

        const helpMessage = `
**Encoding & Decoding Tool**
Usage: \`${prefix}encode <method> <operation> <text>\`

**Methods & Operations:**
- \`base64\` (encode/decode)
- \`binary\` (encode/decode)
- \`hex\` (encode/decode)
- \`rot13\` (applies cipher)
- \`reverse\` (reverses text)
- \`morse\` (encode/decode)
- \`md5\` (hash)
- \`sha256\` (hash)
`;

        if (!method || !operation || !text) {
            return message.edit(helpMessage).catch(() => {});
        }

        let result;

        try {
            switch (method) {
                case 'base64':
                    result = operation === 'encode' ? Buffer.from(text).toString('base64') : Buffer.from(text, 'base64').toString('utf8');
                    break;
                case 'binary':
                    if (operation === 'encode') {
                        result = text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
                    } else {
                        result = text.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
                    }
                    break;
                case 'hex':
                    result = operation === 'encode' ? Buffer.from(text).toString('hex') : Buffer.from(text, 'hex').toString('utf8');
                    break;
                case 'rot13':
                    result = rot13(text);
                    break;
                case 'reverse':
                    result = text.split('').reverse().join('');
                    break;
                case 'morse':
                    if (operation === 'encode') {
                        result = text.toUpperCase().split('').map(char => morseMap[char] || char).join(' ');
                    } else {
                        result = text.split(' ').map(code => reverseMorseMap[code] || code).join('');
                    }
                    break;
                case 'md5':
                case 'sha256':
                    if (operation !== 'hash') throw new Error('Invalid operation for hashing. Use "hash".');
                    result = crypto.createHash(method).update(text).digest('hex');
                    break;
                default:
                    return message.edit(`Invalid method. Please use one of the available methods.\n${helpMessage}`).catch(() => {});
            }

            const output = `\`\`\`\nInput: ${text}\nMethod: ${method} (${operation})\n\nOutput: ${result}\n\`\`\``;
            await message.edit(output);

        } catch (error) {
            console.error("Encode command error:", error);
            await message.edit(`❌ Error processing your request. Please check your input and try again.`).catch(() => {});
        }
    }
};