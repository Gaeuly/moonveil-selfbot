const os = require('os');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = {
    name: 'hwinfo',
    description: 'Displays Neofetch-style system information.',
    aliases: ['neofetch', 'sysinfo'],
    async execute(client, message, args) {
        try {
            const platform = os.platform();
            const arch = os.arch();
            const hostname = os.hostname();
            const cpus = os.cpus();
            const cpuModel = cpus[0]?.model.trim() || 'N/A';
            const totalMemGB = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
            const freeMemGB = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
            const usedMemGB = (totalMemGB - freeMemGB).toFixed(2);
            const uptimeHours = (os.uptime() / 3600).toFixed(1);

            let distro = 'N/A';
            if (platform === 'win32') {
                distro = 'Windows';
            } else if (platform === 'linux') {
                try {
                    const { stdout } = await exec('cat /etc/os-release');
                    const match = stdout.match(/PRETTY_NAME="([^"]+)"/);
                    if (match) distro = match[1];
                } catch (e) {
                    distro = 'Linux';
                }
            } else if (platform === 'darwin') {
                distro = 'macOS';
            }

            const info = `
**🖥️ ${hostname}**
- **OS**: ${distro} (${arch})
- **CPU**: ${cpuModel}
- **RAM**: ${usedMemGB} GB / ${totalMemGB} GB
- **Uptime**: ${uptimeHours} hours
- **Node.js**: ${process.version}
            `;

            await message.edit(`\`\`\`\n${info}\n\`\`\``).catch(() => {});

        } catch (error) {
            await message.edit('Failed to fetch hardware information.').catch(() => {});
        }
    }
};