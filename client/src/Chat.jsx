import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SERVER_URL = import.meta.env.SERVER_URL || "http://localhost:8000";

export default function Chat({ username }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [showDebug, setShowDebug] = useState(false);
  const [debugLogs, setDebugLogs] = useState([]);

  const addDebugLog = (type, message, data = null) => {
    const logEntry = {
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
      data: data ? JSON.stringify(data, null, 2) : null
    };
   console.log(logEntry.data,"DATA");
   
    setDebugLogs(prev => [...prev.slice(-49), logEntry]); // Keep last 50 entries
  };

  console.log(debugLogs,"DEBUGGER");
  

  useEffect(() => {
    const newSocket = io(SERVER_URL, {
      transports: ["websocket"], // force WebSocket transport
    });

    console.log(newSocket,"NEW");
    

    newSocket.on("connect", () => {
      addDebugLog("connect", `Connected with ID: ${newSocket.id}`);
      setConnectionStatus("connected");
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Disconnected");
      addDebugLog("disconnect", "Disconnected from server");
      setConnectionStatus("disconnected");
    });

    newSocket.on("connect_error", (error) => {
      console.log("❌ Connection error:", error);
      addDebugLog("error", "Connection error", error);
      setConnectionStatus("error");
    });

    newSocket.on("chat message", (msg) => {
      console.log("📩 From server:", msg);
      addDebugLog("receive", `Message received from server`, msg);
      
      // Mark messages coming from server as delivered
      const serverMessage = {
        ...msg,
        status: "delivered",
        isFromServer: true,
        isMine: msg.user === username,
        isServerBot: msg.isServerBot || false
      };
      
      setMessages((prev) => {
        // If this message has a tempId, update the existing local message
        if (msg.tempId && msg.user === username) {
          const existingIndex = prev.findIndex(m => m.tempId === msg.tempId);
          if (existingIndex !== -1) {
            addDebugLog("update", `Updated local message with server response`);
            const updated = [...prev];
            updated[existingIndex] = serverMessage;
            return updated;
          }
        }
        // Otherwise, add as new message (from other users)
        addDebugLog("message", `New message from ${msg.user}`);
        return [...prev, serverMessage];
      });
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [username]);

  const sendMessage = () => {
    if (input && socket) {
      const tempId = Date.now() + Math.random(); // unique ID for tracking
      const messageData = { user: username, text: input, tempId: tempId };
      const pendingMsg = { 
        ...messageData,
        status: "sending",
        isFromServer: false,
        isMine: true,
        timestamp: new Date().toLocaleTimeString()
      };
      
      addDebugLog("send", `Sending message to server`, messageData);
      setMessages((prev) => [...prev, pendingMsg]);
      socket.emit("chat message", messageData);
      setInput("");
    }
  };

  const getStatusIndicator = (msg) => {
    if (msg.isMine && msg.status === "sending") {
      return <span className="status-sending">Sending...</span>;
    }
    if (msg.isMine && msg.isFromServer) {
      return <span className="status-delivered">Server Responded</span>;
    }
    return null;
  };

  const getConnectionStatusColor = (status) => {
    switch(status) {
      case "connected": return "#4ade80";
      case "connecting": return "#fbbf24";
      case "disconnected": 
      case "error": return "#ef4444";
      default: return "#6b7280";
    }
  };

  return (
    <div className="chat-root">
      <div className="sidebar">
        <div className="connection-status">
          <div className="status-indicator">
            <div 
              className="status-dot" 
              style={{backgroundColor: getConnectionStatusColor(connectionStatus)}}
            ></div>
            <span className="status-text">
              {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
            </span>
          </div>
        </div>
        <h3>Users</h3>
        <p>{username} (you)</p>
        
        <div className="debug-controls">
          <button 
            className="debug-toggle"
            onClick={() => setShowDebug(!showDebug)}
          >
            🔧 Debug {showDebug ? '▼' : '▶'}
          </button>
          {showDebug && (
            <button 
              className="debug-clear"
              onClick={() => setDebugLogs([])}
            >
              Clear Logs
            </button>
          )}
        </div>
      </div>

      <div className="chat-main">
        <div className="messages">
          {messages.map((msg, i) => (
            <div
              key={msg.tempId || i}
              className={`message ${msg.isMine ? "mine" : "other"} ${msg.isFromServer ? "from-server" : "local"} ${msg.isServerBot ? "server-bot" : ""}`}
            >
              <div className="message-header">
                <div className="user-info">
                  <b className="username">{msg.user}</b>
                  {!msg.isMine && (
                    <span className="message-time">
                      {msg.time || msg.timestamp}
                    </span>
                  )}
                </div>
                {msg.isMine && (
                  <div className="message-status">
                    {getStatusIndicator(msg)}
                    {msg.time && (
                      <span className="server-time">
                        Server: {msg.time}
                      </span>
                    )}
                    {msg.timestamp && !msg.time && (
                      <span className="local-time">
                        {msg.timestamp}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="text">{msg.text}</div>
            </div>
          ))}
        </div>

        {showDebug && (
          <div className="debug-panel">
            <div className="debug-header">
              <h4>WebSocket Debug Log</h4>
            </div>
            <div className="debug-logs">
              {debugLogs.length === 0 ? (
                <div className="debug-empty">No debug logs yet...</div>
              ) : (
                debugLogs.map((log, i) => (
                  <div key={i} className={`debug-entry ${log.type}`}>
                    <div className="debug-meta">
                      <span className="debug-time">{log.timestamp}</span>
                      <span className="debug-type">{log.type}</span>
                    </div>
                    <div className="debug-message">{log.message}</div>
                    {log.data && (
                      <details className="debug-data">
                        <summary>Data</summary>
                        <pre>{log.data}</pre>
                      </details>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div className="composer">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type message..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={connectionStatus !== "connected"}
          />
          <button 
            onClick={sendMessage}
            disabled={connectionStatus !== "connected" || !input.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
