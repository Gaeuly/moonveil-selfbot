module.exports = {
    name: 'mock',
    description: 'MoCk SoMeOnE\'s TeXt.',
    cooldown: 3,
    async execute(client, message, args) {
        if (!args.length) {
            return message.edit('pLeAsE pRoViDe SoMe TeXt To MoCk.').catch(() => {});
        }

        const text = args.join(' ');
        let mocked = '';

        for (let i = 0; i < text.length; i++) {
            mocked += i % 2 === 0 ? text[i].toLowerCase() : text[i].toUpperCase();
        }

        await message.edit(mocked).catch(() => {});
    }
};