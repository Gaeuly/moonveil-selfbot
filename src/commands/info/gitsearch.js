const axios = require('axios');

module.exports = {
    name: 'gitsearch',
    description: 'Searches GitHub for repositories.',
    cooldown: 15,
    async execute(client, message, args) {
        if (!args.length) {
            return message.edit('Please provide a search query for GitHub.').catch(() => {});
        }
        const query = args.join(' ');

        try {
            const response = await axios.get(`https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc`);
            const items = response.data.items;

            if (items.length === 0) {
                return message.edit(`No repositories found for **"${query}"**.`);
            }

            const repositories = items.slice(0, 5).map((repo, index) => {
                return `${index + 1}. [${repo.full_name}](${repo.html_url}) - ⭐ ${repo.stargazers_count}`;
            }).join('\n');

            await message.edit(`**Top 5 GitHub Repositories for "${query}":**\n${repositories}`).catch(() => {});
        } catch (error) {
            console.error('GitHub search error:', error);
            await message.edit('An error occurred while searching GitHub.').catch(() => {});
        }
    }
};