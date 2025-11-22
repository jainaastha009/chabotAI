// client/src/App.js
import React, { useState } from 'react';
import Chat from './Chat';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [joined, setJoined] = useState(false);

  return (
    <div className="app-shell">
    
      {!joined ? (
        <div className="join-box">
          <h2>Join Chat</h2>
          <input
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={() => setJoined(true)} disabled={!name.trim()}>
            Join
          </button>
        </div>
      ) : (
        <Chat username={name} />
      )}
    </div>
  );
}

export default App;
