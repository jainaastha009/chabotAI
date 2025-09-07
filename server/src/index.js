import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Vite frontend
    methods: ["GET", "POST"],
  },
});

// Function to generate smart server responses
function generateServerResponse(userMessage, userName) {
  const responses = [
    // Greetings
    {
      triggers: ["hello", "hi", "hey", "good morning", "good evening"],
      replies: [
        `Hello ${userName}! 👋 How are you doing today?`,
        `Hi there ${userName}! Great to see you here! 😊`,
        `Hey ${userName}! What's on your mind?`
      ]
    },
    // Questions about weather
    {
      triggers: ["weather", "sunny", "rain", "cold", "hot"],
      replies: [
        "I can't check the weather, but I hope it's nice where you are! ☀️",
        "Weather talk, huh? I'm just here in the digital realm! 🌤️",
        "Sounds like weather is on your mind! Stay cozy! 🌈"
      ]
    },
    // Tech-related
    {
      triggers: ["javascript", "react", "code", "programming", "developer", "tech"],
      replies: [
        "Ah, a fellow tech enthusiast! 💻 Love talking about development!",
        "Programming is awesome! What are you building? 🚀",
        "Tech talk! I'm made with Node.js and Socket.io myself! 🤖"
      ]
    },
    // Emotional responses
    {
      triggers: ["love", "like", "awesome", "great", "amazing", "wonderful"],
      replies: [
        "That sounds wonderful! ❤️",
        "I'm glad you're feeling positive! ✨",
        "Positivity is contagious! 🌟"
      ]
    },
    // Questions
    {
      triggers: ["how", "what", "why", "when", "where", "?"],
      replies: [
        "That's a great question! 🤔 What do you think?",
        "Interesting question! I'd love to hear your thoughts on it! 💭",
        "You've got me thinking! Share more about what you mean! 🧠"
      ]
    },
    // Time-related
    {
      triggers: ["time", "late", "early", "morning", "night", "afternoon"],
      replies: [
        `It's ${new Date().toLocaleTimeString()} on my server! ⏰`,
        "Time flies when you're having fun chatting! ⏳",
        "Time is just a construct... but yes, I can tell time! 🕐"
      ]
    },
    // Goodbye
    {
      triggers: ["bye", "goodbye", "see you", "later", "gtg"],
      replies: [
        `See you later, ${userName}! Take care! 👋`,
        "Goodbye! Thanks for the chat! 🌟",
        "Until next time! Have a great day! 😊"
      ]
    }
  ];

  const userText = userMessage.toLowerCase();
  
  // Find matching response category
  for (const category of responses) {
    if (category.triggers.some(trigger => userText.includes(trigger))) {
      const randomReply = category.replies[Math.floor(Math.random() * category.replies.length)];
      return randomReply;
    }
  }
  
  // Default responses for unmatched messages
  const defaultReplies = [
    "That's interesting! Tell me more! 🤔",
    "I hear you! What else is on your mind? 💭",
    `Thanks for sharing that, ${userName}! 😊`,
    "Hmm, that's something to think about! 🧐",
    "I appreciate you chatting with me! What else would you like to talk about? 🗣️",
    "That's a unique perspective! 🌟",
    "I'm listening! Please continue! 👂",
    `You're quite thoughtful, ${userName}! 💡`
  ];
  
  return defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
}

io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id);

  // Send welcome message from server bot
  setTimeout(() => {
    const welcomeMsg = {
      user: "🤖 ChatBot",
      text: "Welcome to the chat! 👋 I'm your friendly server bot. I'll respond to your messages automatically! Try saying 'hello' or asking me about the weather! ✨",
      time: new Date().toLocaleTimeString(),
      serverProcessedAt: new Date().toISOString(),
      processedBy: "server",
      isServerBot: true
    };
    
    socket.emit("chat message", welcomeMsg);
  }, 500);

  socket.on("chat message", (msg) => {
    console.log("📩 Received:", msg);

    // Add timestamp and server processing info before sending back
    const serverMsg = {
      ...msg,
      time: new Date().toLocaleTimeString(),
      serverProcessedAt: new Date().toISOString(),
      processedBy: "server"
    };

    // Send enriched message to all clients
    io.emit("chat message", serverMsg);

    // Generate automatic server response after a delay
    setTimeout(() => {
      const serverResponse = generateServerResponse(msg.text, msg.user);
      const serverReply = {
        user: "🤖 ChatBot",
        text: serverResponse,
        time: new Date().toLocaleTimeString(),
        serverProcessedAt: new Date().toISOString(),
        processedBy: "server",
        isServerBot: true
      };
      
      console.log("🤖 Server responding:", serverReply.text);
      io.emit("chat message", serverReply);
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

const PORT = 8000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
