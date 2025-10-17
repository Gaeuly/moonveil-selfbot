const axios = require('axios');

module.exports = {
    name: 'metadata',
    description: 'Extracts metadata from an attached file.',
    aliases: ['fileinfo'],
    async execute(client, message, args) {
        const attachment = message.attachments.first();
        if (!attachment) {
            return message.edit('Please attach a file to analyze.').catch(() => {});
        }

        try {
            await message.edit('📄 Analyzing file...').catch(() => {});

            const response = await axios.get(attachment.url, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data);
            
            // Dynamically import the file-type module
            const { fileTypeFromBuffer } = await import('file-type');
            const type = await fileTypeFromBuffer(buffer);

            const meta = {
                FileName: attachment.name,
                FileSize: `${(attachment.size / 1024).toFixed(2)} KB`,
                FileType: type ? type.mime : 'unknown',
                URL: attachment.url
            };

            let report = '**📄 File Metadata:**\n```json\n';
            report += JSON.stringify(meta, null, 2);
            report += '\n```';

            await message.edit(report).catch(() => {});

        } catch (error) {
            console.error(error);
            await message.edit('Failed to extract metadata from the file.').catch(() => {});
        }
    }
};