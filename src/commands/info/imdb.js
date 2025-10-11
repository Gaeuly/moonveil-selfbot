module.exports = {
    name: 'imdb',
    description: 'Search for a movie on IMDB.',
    cooldown: 10,
    async execute(client, message, args) {
        if (!args.length) {
            return message.edit('Please provide a movie title to search for.').catch(() => {});
        }
        
        const query = encodeURIComponent(args.join(' '));
        const searchUrl = `https://www.imdb.com/find?q=${query}`;
        
        await message.edit(`🎬 **IMDB Search for "${args.join(' ')}":**\n${searchUrl}`).catch(() => {});
    }
};