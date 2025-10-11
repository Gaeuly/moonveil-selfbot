const axios = require('axios');

module.exports = {
    name: 'gituser',
    description: 'Retrieves information about a GitHub user.',
    cooldown: 10,
    async execute(client, message, args) {
        if (!args.length) {
            return message.edit('Please provide a GitHub username.').catch(() => {});
        }
        const username = args[0];

        try {
            const response = await axios.get(`https://api.github.com/users/${username}`);
            const user = response.data;

            const userInfo = `**GitHub Profile: ${user.login}**\n\n` +
                             `> **Name:** ${user.name || 'N/A'}\n` +
                             `> **Bio:** ${user.bio || 'N/A'}\n` +
                             `> **Followers:** ${user.followers} | **Following:** ${user.following}\n` +
                             `> **Public Repos:** ${user.public_repos}\n` +
                             `> **URL:** ${user.html_url}`;

            await message.edit(userInfo).catch(() => {});
        } catch (error) {
            if (error.response && error.response.status === 404) {
                await message.edit(`User **${username}** not found on GitHub.`).catch(() => {});
            } else {
                console.error('Gituser error:', error);
                await message.edit('An error occurred while fetching user information.').catch(() => {});
            }
        }
    }
};