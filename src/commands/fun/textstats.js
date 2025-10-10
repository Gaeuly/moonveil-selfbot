const countSyllables = (text) => {
    if (!text) return 0;
    text = text.toLowerCase();
    let count = 0;
    const words = text.split(/\s+/);

    words.forEach(word => {
        if (word.length <= 3) {
            count += 1;
            return;
        }
        word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
        word = word.replace(/^y/, '');
        const matches = word.match(/[aeiouy]{1,2}/g);
        count += matches ? matches.length : 1;
    });
    return Math.max(1, count);
};

const calculateReadingLevel = (text) => {
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const syllables = countSyllables(text);

    if (words.length < 30 || sentences.length < 3) {
        return 'Basic';
    }

    const avgWordsPerSentence = words.length / sentences.length;
    const avgSyllablesPerWord = syllables / words.length;
    const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);

    if (score >= 90) return 'Very Easy (5th grade)';
    if (score >= 80) return 'Easy (6th grade)';
    if (score >= 70) return 'Fairly Easy (7th grade)';
    if (score >= 60) return 'Standard (8th-9th grade)';
    if (score >= 50) return 'Fairly Difficult (10th-12th grade)';
    if (score >= 30) return 'Difficult (College)';
    return 'Very Difficult (Post-graduate)';
};

module.exports = {
    name: 'textstats',
    description: 'Analyze text statistics and information',
    aliases: ['stats', 'wordcount'],
    cooldown: 5,
    async execute(client, message, args) {
        if (args.length === 0) {
            return message.edit('Please provide some text to analyze. Usage: `!textstats <your text here>`').catch(() => {});
        }

        const text = args.join(' ');

        const charCount = text.length;
        const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
        const sentenceCount = Math.max(1, text.split(/[.!?]+/).filter(s => s.trim().length > 0).length);
        const lineCount = text.split('\n').length;
        
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        const wordFrequency = {};
        words.forEach(word => {
            wordFrequency[word] = (wordFrequency[word] || 0) + 1;
        });
        
        const mostCommon = Object.entries(wordFrequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
        
        const avgWordLength = words.length > 0 ? (words.reduce((sum, word) => sum + word.length, 0) / words.length) : 0;
        const avgSentenceLength = wordCount / sentenceCount;
        
        const readingTime = Math.ceil(wordCount / 200);
        const readingLevel = calculateReadingLevel(text);
        
        const stats = `**📊 Text Statistics**
- **Characters:** ${charCount}
- **Words:** ${wordCount}
- **Sentences:** ${sentenceCount}
- **Lines:** ${lineCount}
- **Avg. word length:** ${avgWordLength.toFixed(2)} chars
- **Avg. sentence length:** ${avgSentenceLength.toFixed(2)} words
- **Reading time:** ~${readingTime} minute(s)
- **Reading level:** ${readingLevel}

**📈 Most Common Words:**
${mostCommon.map(([word, count]) => `- "${word}": ${count} time(s)`).join('\n') || 'N/A'}
        `.trim();

        await message.edit(stats).catch(() => {});
    },
};