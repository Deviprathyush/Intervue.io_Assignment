import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); 

function App() {
  const [name, setName] = useState(sessionStorage.getItem('studentName') || '');
  const [inputName, setInputName] = useState('');
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [hasAnswered, setHasAnswered] = useState(false);
  const [results, setResults] = useState(null);
  const [timer, setTimer] = useState(60); // 60 seconds

  useEffect(() => {
    if (name) {
      sessionStorage.setItem('studentName', name);
    }
  }, [name]);

  useEffect(() => {
    socket.on('new-question', (q) => {
      setQuestion(q);
      setHasAnswered(false);
      setResults(null);
      setTimer(60);
    });

    socket.on('poll-results', (data) => {
      setResults(data);
    });

    return () => {
      socket.off('new-question');
      socket.off('poll-results');
    };
  }, []);

  useEffect(() => {
    if (!question || hasAnswered) return;

    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(interval);
          setHasAnswered(true);
          socket.emit('timeout', { name });
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [question, hasAnswered]);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (inputName.trim()) {
      setName(inputName.trim());
    }
  };

  const submitAnswer = () => {
    if (answer.trim()) {
      socket.emit('submit-answer', { name, answer });
      setHasAnswered(true);
    }
  };

  if (!name) {
    return (
      <div className="name-form">
        <h2>Enter Your Name</h2>
        <form onSubmit={handleNameSubmit}>
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder="Your name"
          />
          <button type="submit">Join Poll</button>
        </form>
      </div>
    );
  }

  return (
    <div className="student-poll">
      <h2>Welcome, {name}</h2>

      {!question && <p>Waiting for the teacher to start a poll...</p>}

      {question && !hasAnswered && (
        <div>
          <h3>📝 Question: {question.text}</h3>
          <p>⏱️ Time Left: {timer}s</p>
          {question.options.map((opt, idx) => (
            <div key={idx}>
              <input
                type="radio"
                id={`option-${idx}`}
                name="answer"
                value={opt}
                onChange={(e) => setAnswer(e.target.value)}
              />
              <label htmlFor={`option-${idx}`}>{opt}</label>
            </div>
          ))}
          <button onClick={submitAnswer} disabled={!answer}>Submit Answer</button>
        </div>
      )}

      {hasAnswered && (
        <div>
          <h3>📊 Live Poll Results</h3>
          {!results ? (
            <p>Waiting for others to submit...</p>
          ) : (
            <ul>
              {Object.entries(results).map(([option, count]) => (
                <li key={option}>
                  {option}: {count} votes
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
