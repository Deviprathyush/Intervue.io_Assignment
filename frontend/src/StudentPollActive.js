import React, { useEffect, useState } from 'react';
import './App.css';

function StudentPollActive() {
  const [poll, setPoll] = useState(null);
  const [selected, setSelected] = useState('');

  useEffect(() => {
    const data = localStorage.getItem('poll');
    if (data) setPoll(JSON.parse(data));
  }, []);

  const handleSubmit = () => {
    if (selected) {
      // send answer logic here
      console.log('Student submitted:', selected);
    }
  };

  if (!poll) return <div>Loading poll...</div>;

  return (
    <div className="form-container">
      <div className="form-section">
        <div className="badge">📘 Intervue Poll</div>
        <h3 className="bold">Question</h3>
        <p className="question-text">{poll.question}</p>

        <div className="poll-options">
          {poll.options.map((opt, i) => (
            <div
              key={i}
              className={`poll-option ${selected === opt ? 'selected' : ''}`}
              onClick={() => setSelected(opt)}
            >
              {opt}
            </div>
          ))}
        </div>

        <button
          className="continue-btn"
          disabled={!selected}
          onClick={handleSubmit}
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
}

export default StudentPollActive;
