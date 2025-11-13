const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Chatbot API endpoint
app.post('/api/chat', (req, res) => {
    const userMessage = req.body.message.toLowerCase().trim();
    const response = generateResponse(userMessage);
    
    res.json({ 
        message: response,
        timestamp: new Date().toISOString()
    });
});

// Chatbot logic - Pattern matching based responses
function generateResponse(message) {
    // Greetings
    if (/^(hi|hello|hey|howdy|greetings)/i.test(message)) {
        return getRandomResponse([
            "Hello! How can I help you today?",
            "Hi there! What can I do for you?",
            "Hey! How are you doing?",
            "Greetings! What's on your mind?"
        ]);
    }
    
    // How are you
    if (/how are you|how're you|how r u/i.test(message)) {
        return getRandomResponse([
            "I'm doing great, thank you for asking! How about you?",
            "I'm excellent! Ready to help you with anything.",
            "I'm functioning perfectly! How can I assist you today?"
        ]);
    }
    
    // Name questions
    if (/what is your name|what's your name|who are you/i.test(message)) {
        return "I'm ChatBot, your friendly AI assistant! I'm here to help answer your questions.";
    }
    
    // Time questions
    if (/what time|current time|time is it/i.test(message)) {
        const now = new Date();
        return `The current time is ${now.toLocaleTimeString()}.`;
    }
    
    // Date questions
    if (/what date|today's date|what day/i.test(message)) {
        const now = new Date();
        return `Today is ${now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`;
    }
    
    // Help
    if (/help|what can you do|your capabilities/i.test(message)) {
        return "I can help you with:\n• Answering general questions\n• Providing the current time and date\n• Having casual conversations\n• Telling jokes\n• Sharing interesting facts\n• And much more! Just ask me anything!";
    }
    
    // Jokes
    if (/tell me a joke|make me laugh|joke|funny/i.test(message)) {
        return getRandomResponse([
            "Why don't scientists trust atoms? Because they make up everything! 😄",
            "Why did the programmer quit his job? Because he didn't get arrays! 💻",
            "What do you call a bear with no teeth? A gummy bear! 🐻",
            "Why don't eggs tell jokes? They'd crack each other up! 🥚",
            "What did the ocean say to the beach? Nothing, it just waved! 🌊"
        ]);
    }
    
    // Facts
    if (/tell me a fact|interesting fact|fun fact|did you know/i.test(message)) {
        return getRandomResponse([
            "Did you know? Honey never spoils. Archaeologists have found 3000-year-old honey in Egyptian tombs that's still edible! 🍯",
            "Fun fact: Octopuses have three hearts and blue blood! 🐙",
            "Interesting: A group of flamingos is called a 'flamboyance'! 🦩",
            "Did you know? Bananas are berries, but strawberries aren't! 🍌",
            "Fun fact: The shortest war in history lasted only 38 minutes! ⚔️"
        ]);
    }
    
    // Weather (mock response since we don't have API)
    if (/weather|temperature|forecast/i.test(message)) {
        return "I don't have access to real-time weather data, but I'd recommend checking your local weather service or weather.com for accurate forecasts! 🌤️";
    }
    
    // Math operations
    if (/calculate|what is|solve/i.test(message)) {
        const mathMatch = message.match(/(\d+)\s*([\+\-\*\/])\s*(\d+)/);
        if (mathMatch) {
            const num1 = parseFloat(mathMatch[1]);
            const operator = mathMatch[2];
            const num2 = parseFloat(mathMatch[3]);
            let result;
            
            switch(operator) {
                case '+': result = num1 + num2; break;
                case '-': result = num1 - num2; break;
                case '*': result = num1 * num2; break;
                case '/': result = num2 !== 0 ? num1 / num2 : 'Error: Division by zero'; break;
                default: return "I couldn't perform that calculation.";
            }
            
            return `${num1} ${operator} ${num2} = ${result}`;
        }
    }
    
    // Thank you
    if (/thank you|thanks|thank u|thx/i.test(message)) {
        return getRandomResponse([
            "You're welcome! Happy to help! 😊",
            "No problem at all!",
            "Anytime! Feel free to ask more questions!",
            "Glad I could help!"
        ]);
    }
    
    // Goodbye
    if (/bye|goodbye|see you|later|exit|quit/i.test(message)) {
        return getRandomResponse([
            "Goodbye! Have a great day! 👋",
            "See you later! Take care!",
            "Bye! Come back anytime!",
            "Until next time! 😊"
        ]);
    }
    
    // Age
    if (/how old are you|your age/i.test(message)) {
        return "I'm timeless! I was created recently, but I don't age like humans do. 🤖";
    }
    
    // Hobbies
    if (/hobby|hobbies|what do you like/i.test(message)) {
        return "I love chatting with people like you! I also enjoy processing information and helping solve problems. 💬";
    }
    
    // Programming questions
    if (/programming|coding|code|developer|software/i.test(message)) {
        return "Programming is fascinating! I'm built using Node.js and JavaScript. Are you interested in learning programming?";
    }
    
    // Motivation
    if (/motivate|inspiration|encourage/i.test(message)) {
        return getRandomResponse([
            "Believe in yourself! You're capable of amazing things! 💪",
            "Every expert was once a beginner. Keep going!",
            "Success is not final, failure is not fatal: it is the courage to continue that counts.",
            "The only way to do great work is to love what you do. - Steve Jobs"
        ]);
    }
    
    // Default responses
    return getRandomResponse([
        "That's interesting! Tell me more.",
        "I'm not sure I fully understand. Could you rephrase that?",
        "Hmm, that's a good question! Can you provide more details?",
        "I'm still learning! Can you ask me something else?",
        "That's beyond my current knowledge, but I'm always learning new things!",
        "Interesting point! What else would you like to know?"
    ]);
}

// Helper function to get random response
function getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
}

// Start server
app.listen(PORT, () => {
    console.log(`🤖 Chatbot server is running on http://localhost:${PORT}`);
    console.log(`Open your browser and navigate to http://localhost:${PORT}`);
});
