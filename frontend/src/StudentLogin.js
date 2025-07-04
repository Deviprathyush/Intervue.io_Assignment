import React, { useState, useEffect } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

function StudentLogin() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleJoin = () => {
    if (name.trim()) {
      socket.emit('student:join', name);
      localStorage.setItem('studentName', name); // save for later use
      navigate('/student/waiting');
    }
  };

  useEffect(() => {
    socket.on('poll:new', (data) => {
      console.log('Received poll:', data);
      localStorage.setItem('poll', JSON.stringify(data)); // save question
      navigate('/student/active');
    });

    return () => {
      socket.off('poll:new');
    };
  }, [navigate]);

  return (
    <div className="form-container">
      <div className="form-section">
        <div className="badge">📘 Intervue Poll</div>
        <h2>
          Enter your <span className="bold">Name</span>
        </h2>
        <input
          type="text"
          className="input-box"
          placeholder="Your name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="continue-btn" onClick={handleJoin}>
          Join
        </button>
      </div>
    </div>
  );
}

export default StudentLogin;
