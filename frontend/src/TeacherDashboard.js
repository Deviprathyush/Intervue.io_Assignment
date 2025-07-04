import React, { useState } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom'; // ✅ Add this
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Make sure backend is running on 3001

function TeacherDashboard() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [correct, setCorrect] = useState([false, false]);
  const [timeLimit, setTimeLimit] = useState(60);
  const navigate = useNavigate(); // ✅ Initialize navigate

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleCorrectChange = (index, value) => {
    const updated = [...correct];
    updated[index] = value === 'yes';
    setCorrect(updated);
  };

  const addOption = () => {
    setOptions([...options, '']);
    setCorrect([...correct, false]);
  };

  const handleAskQuestion = () => {
    const cleanedOptions = options.filter(opt => opt.trim() !== '');
    if (!question.trim() || cleanedOptions.length < 2) {
      alert("Please enter a valid question and at least 2 options.");
      return;
    }

    const payload = {
      question,
      options: cleanedOptions,
      time: timeLimit
    };

    console.log("Emitting teacher:create_poll", payload);
    socket.emit('teacher:create_poll', payload);

    // ✅ Navigate after poll is created
    navigate('/teacher/result'); // or another route like /teacher/waiting
  };

  return (
    <div className="form-container">
      <div className="form-section">
        <div className="badge">📘 Intervue Poll</div>
        <h2>
          Let’s <span className="bold">Get Started</span>
        </h2>
        <p className="subtitle">
          You’ll have the ability to create and manage polls, ask questions, and monitor your students’ responses in real-time.
        </p>

        <div className="question-input">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>Enter your question</strong>
            <select
              value={timeLimit}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
              className="dropdown"
            >
              {[30, 45, 60, 90].map((t) => (
                <option key={t} value={t}>{t} seconds</option>
              ))}
            </select>
          </div>
          <textarea
            maxLength="100"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question..."
            className="textarea"
          />
          <div className="char-limit">{question.length}/100</div>
        </div>

        <div className="options-section">
          <label><strong>Edit Options</strong></label>
          {options.map((opt, i) => (
            <div key={i} className="option-row">
              <div className="option-left">
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => handleOptionChange(i, e.target.value)}
                  className="input-box"
                  placeholder={`Option ${i + 1}`}
                />
              </div>
              <div className="option-right">
                <label>
                  <input
                    type="radio"
                    name={`correct-${i}`}
                    value="yes"
                    checked={correct[i]}
                    onChange={(e) => handleCorrectChange(i, e.target.value)}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name={`correct-${i}`}
                    value="no"
                    checked={!correct[i]}
                    onChange={(e) => handleCorrectChange(i, e.target.value)}
                  />
                  No
                </label>
              </div>
            </div>
          ))}
          <button onClick={addOption} className="add-option-btn">+ Add More option</button>
        </div>

        <button
          className="continue-btn"
          style={{ marginTop: '24px' }}
          onClick={handleAskQuestion}
        >
          Ask Question
        </button>
      </div>
    </div>
  );
}

export default TeacherDashboard;
