import React from 'react';
import './App.css';

function StudentPollResults({ question, results }) {
  const totalVotes = results.reduce((sum, r) => sum + r.votes, 0);

  return (
    <div className="form-container">
      <div className="form-section">
        <div className="badge">📘 Intervue Poll</div>
        <h3 className="bold">Live Poll Results</h3>
        <p className="question-text">{question}</p>

        {results.map((opt, i) => {
          const percent = totalVotes ? Math.round((opt.votes / totalVotes) * 100) : 0;
          return (
            <div key={i} className="result-option">
              <div className="option-label">
                <strong>{opt.text}</strong> — {opt.votes} votes ({percent}%)
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${percent}%` }}></div>
              </div>
            </div>
          );
        })}
        <p className="waiting-text">Wait for the teacher to ask a new question...</p>
      </div>
    </div>
  );
}

export default StudentPollResults;
