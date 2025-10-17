const https = require('https');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function downloadAsset(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            const chunks = [];
            res.on('data', chunk => chunks.push(chunk));
            res.on('end', () => resolve(Buffer.concat(chunks)));
            res.on('error', reject);
        }).on('error', reject);
    });
}

module.exports = { delay, downloadAsset };