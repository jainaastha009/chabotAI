# 🚀 Real-time WebSocket Chat Application

A modern, full-stack real-time chat application built with React, Node.js, Express, and Socket.io. Features a beautiful UI with automatic server responses, message status tracking, and a comprehensive debug panel for WebSocket monitoring.

![Chat Application](https://img.shields.io/badge/Status-Active-brightgreen) ![React](https://img.shields.io/badge/React-19.1.1-blue) ![Node.js](https://img.shields.io/badge/Node.js-Latest-green) ![Socket.io](https://img.shields.io/badge/Socket.io-4.8.1-black)

## ✨ Features

### 🎨 **Modern UI/UX**
- Full-page responsive design with gradient backgrounds
- Modern chat bubble layout (left for others, right for user)
- Glassmorphism effects with backdrop blur
- Smooth animations and transitions
- Mobile-responsive design

### 💬 **Chat Features**
- Real-time messaging with WebSocket
- Automatic server bot responses with smart AI-like replies
- Message status indicators (Sending... → Server Responded)
- Timestamp display for all messages
- Clear visual distinction between local and server-processed messages

### 🔧 **Developer Features**
- Live WebSocket debug panel with detailed logging
- Connection status indicator
- Message tracking with unique IDs
- Comprehensive error handling
- Real-time connection monitoring

### 🤖 **Smart Server Bot**
- Context-aware responses based on message content
- Multiple response categories (greetings, tech talk, weather, etc.)
- Personalized responses using username
- Random response delays for natural feel
- Welcome messages for new users

## 🛠️ Tech Stack

### Frontend
- **React 19.1.1** - UI framework
- **Vite 7.1.2** - Build tool and dev server
- **Socket.io Client 4.8.1** - WebSocket client
- **Modern CSS** - Gradients, backdrop filters, animations

### Backend
- **Node.js** - Runtime environment
- **Express 5.1.0** - Web framework
- **Socket.io 4.8.1** - WebSocket server
- **CORS 2.8.5** - Cross-origin resource sharing
- **Nodemon 3.1.10** - Development auto-restart

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Modern web browser

### 1. Clone the Repository
```bash
git clone https://github.com/Akhilesh1104/Websockets.git
cd Websockets
```

### 2. Install Server Dependencies
```bash
cd server
npm install
```

### 3. Install Client Dependencies
```bash
cd ../client
npm install
```

## 🚀 Running the Application

### Start the Server (Terminal 1)
```bash
cd server
npm run dev
# or for production
npm start
```
Server will start on `http://localhost:8000`

### Start the Client (Terminal 2)
```bash
cd client
npm run dev
```
Client will start on `http://localhost:5173`

### 🌐 Access the Application
Open your browser and navigate to `http://localhost:5173`

## 📁 Project Structure

```
Websockets/
├── README.md
├── .gitignore
├── server/                 # Backend application
│   ├── src/
│   │   └── index.js       # Main server file with Socket.io setup
│   ├── package.json
│   └── package-lock.json
└── client/                 # Frontend application
    ├── src/
    │   ├── App.jsx        # Main app component
    │   ├── Chat.jsx       # Chat interface component
    │   ├── App.css        # Main stylesheet
    │   ├── main.jsx       # React entry point
    │   └── assets/        # Static assets
    ├── public/
    ├── index.html
    ├── package.json
    ├── package-lock.json
    └── vite.config.js
```

## 🔌 WebSocket Events

### Client → Server
- `chat message`: Send a new chat message
  ```javascript
  socket.emit("chat message", { 
    user: "username", 
    text: "message content", 
    tempId: uniqueId 
  });
  ```

### Server → Client
- `chat message`: Receive processed messages
  ```javascript
  socket.on("chat message", (message) => {
    // Handle incoming message
  });
  ```

## 🎯 Key Features Explained

### Message Flow
1. **User types message** → Shows as "Sending..." with yellow gradient
2. **Server processes** → Updates to "Server Responded" with blue gradient
3. **Server bot responds** → Appears on left with green gradient and 🤖 indicator

### Debug Panel
- Toggle debug mode to see real-time WebSocket activity
- View connection status, message flow, and server responses
- Clear logs functionality
- Collapsible interface

### Responsive Design
- Full viewport utilization
- Mobile-optimized chat bubbles
- Flexible sidebar with connection status
- Gradient backgrounds with glassmorphism

## 🔧 Configuration

### Server Configuration
- **Port**: 8000 (configurable in `server/src/index.js`)
- **CORS**: Configured for Vite dev server (localhost:5173)
- **WebSocket**: Forced WebSocket transport for reliability

### Client Configuration
- **Server URL**: Configurable via environment variable
- **Connection**: Auto-reconnection enabled
- **Transport**: WebSocket only

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Troubleshooting

### Common Issues

**Connection Issues**
- Ensure server is running on port 8000
- Check CORS configuration matches your client URL
- Verify firewall isn't blocking WebSocket connections

**UI Issues**
- Clear browser cache and reload
- Ensure modern browser with CSS Grid/Flexbox support
- Check console for JavaScript errors

**Development Issues**
- Run `npm install` in both client and server directories
- Ensure Node.js version compatibility
- Check for port conflicts


## 🙋‍♂️ Support

If you have any questions or need help with setup, please open an issue in the repository.

## 🌟 Acknowledgments

- Socket.io for excellent WebSocket implementation
- React team for the amazing framework
- Vite for lightning-fast development experience
- The open-source community for inspiration and tools

