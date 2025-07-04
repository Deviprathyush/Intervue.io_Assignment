import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
const socket = io('http://localhost:3001');

function StudentPollWaiting() {
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('poll:new', (data) => {
      console.log("📩 Student received question:", data);
      localStorage.setItem('questionData', JSON.stringify(data));
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
        <p className="subtitle bold">Wait for the teacher to ask a question...</p>
      </div>
    </div>
  );
}

export default StudentPollWaiting;
