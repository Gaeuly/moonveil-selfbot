    const fs = require('fs');
    const path = require('path');
    
    const dataDir = path.join(__dirname, '..', '..', 'data');
    const configPath = path.join(dataDir, 'ai_config.json');
    
    let aiConfig = {
        enabled: false,
        prompt: "You are a helpful assistant. Keep your responses concise and friendly."
    };
    
    function saveConfig() {
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        fs.writeFileSync(configPath, JSON.stringify(aiConfig, null, 2));
    }
    
    function loadConfig() {
        if (fs.existsSync(configPath)) {
            try {
                const data = fs.readFileSync(configPath, 'utf8');
                aiConfig = JSON.parse(data);
                console.log('Handler: AI config loaded successfully.');
            } catch (error) {
                console.error('Handler: Failed to load AI config.', error);
            }
        } else {
            saveConfig();
        }
    }
    
    loadConfig();
    
    const conversationHistories = new Map();
    
    async function getAiReply(history) {
        // Ambil API Key dari file .env
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("AI Error: GEMINI_API_KEY is not set in the .env file.");
            return "Sorry, the AI is not configured correctly (missing API key).";
        }
    
        try {
            const fullHistory = [
                { role: "user", parts: [{ text: aiConfig.prompt }] },
                { role: "model", parts: [{ text: "Okay, I will act according to that prompt." }] },
                ...history
            ];
    
            const payload = {
                contents: fullHistory,
            };
    
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
    
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
    
            if (!response.ok) {
                console.error("AI API Error:", await response.text());
                return "Sorry, my brain is a bit fuzzy right now. Can't reply.";
            }
    
            const result = await response.json();
            return result.candidates?.[0]?.content?.parts?.[0]?.text || null;
    
        } catch (error) {
            console.error('Error calling Gemini API:', error);
            return "Oops, connection to my AI brain failed.";
        }
    }
    
    module.exports = {
        async handleAiResponse(client, message) {
            if (!aiConfig.enabled || message.author.bot || message.author.id === client.user.id) {
                return;
            }
    
            const isReplyToMe = message.reference && message.reference.messageId ? 
                await message.channel.messages.fetch(message.reference.messageId).then(msg => msg.author.id === client.user.id).catch(() => false) : false;
            
            const isMentioningMe = message.mentions.users.has(client.user.id);
            const isMentioningUsername = message.content.toLowerCase().includes(client.user.username.toLowerCase());
            const isMentioningRole = message.mentions.roles.size > 0;
    
            if (!isMentioningRole && (isReplyToMe || isMentioningMe || isMentioningUsername)) {
                await message.channel.sendTyping();
    
                const userMessage = message.content;
                const channelId = message.channel.id;
    
                if (!conversationHistories.has(channelId)) {
                    conversationHistories.set(channelId, []);
                }
                const history = conversationHistories.get(channelId);
                history.push({ role: "user", parts: [{ text: userMessage }] });
    
                if (history.length > 10) {
                    history.splice(0, history.length - 10);
                }
    
                const aiResponse = await getAiReply(history);
    
                if (aiResponse) {
                    history.push({ role: "model", parts: [{ text: aiResponse }] });
                    await message.reply(aiResponse);
                }
            }
        },
    
        toggleAI(status) {
            aiConfig.enabled = status;
            saveConfig();
            return aiConfig.enabled;
        },
    
        setPrompt(newPrompt) {
            if (!newPrompt) return null;
            aiConfig.prompt = newPrompt;
            saveConfig();
            return aiConfig.prompt;
        }
    };