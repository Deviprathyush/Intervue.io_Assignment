import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css'; // Make sure styles are in here

const socket = io('http://localhost:3001');

function TeacherResultPage() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [results, setResults] = useState({});

  useEffect(() => {
    socket.on('poll:new', (data) => {
      setQuestion(data.question);
      setOptions(data.options);
    });

    socket.on('poll:update_results', (data) => {
      setResults(data);
    });

    return () => {
      socket.off('poll:new');
      socket.off('poll:update_results');
    };
  }, []);

  const totalVotes = Object.values(results).reduce((sum, count) => sum + count, 0);

  return (
    <div className="form-container">
      <div className="form-section">
        <div className="badge">📘 Intervue Poll</div>
        <h2 className="bold">Live Poll Results</h2>
        <p className="subtitle">{question}</p>

        <div className="poll-options">
          {options.map((opt, i) => {
            const votes = results[opt] || 0;
            const percentage = totalVotes ? ((votes / totalVotes) * 100).toFixed(1) : 0;
            return (
              <div key={i} className="poll-result-bar">
                <div className="bar-text">
                  <strong>{opt}</strong> — {votes} votes ({percentage}%)
                </div>
                <div className="progress-bar">
                  <div className="filler" style={{ width: `${percentage}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TeacherResultPage;
