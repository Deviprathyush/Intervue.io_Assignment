import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Home() {
  const [selectedRole, setSelectedRole] = useState('');
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedRole === 'student') navigate('/student');
    else if (selectedRole === 'teacher') navigate('/teacher');
  };

  return (
    <div className="form-container">
      <div className="form-section">
        <div className="badge">📘 Intervue Poll</div>
        <h2>
          Welcome to the <span className="bold">Live Polling System</span>
        </h2>
        <p className="subtitle">Please select the role that best describes you to begin using the system</p>

        <div className="role-buttons">
          <div
            className={`role-option ${selectedRole === 'student' ? 'selected' : ''}`}
            onClick={() => setSelectedRole('student')}
          >
            <strong>I’m a Student</strong>
            <p className="desc">Lorem Ipsum is simply dummy text of the printing and typesetting industry</p>
          </div>
          <div
            className={`role-option ${selectedRole === 'teacher' ? 'selected' : ''}`}
            onClick={() => setSelectedRole('teacher')}
          >
            <strong>I’m a Teacher</strong>
            <p className="desc">Submit answers and view live poll results in real-time</p>
          </div>
        </div>

        <button className="continue-btn" onClick={handleContinue} disabled={!selectedRole}>
          Continue
        </button>
      </div>
    </div>
  );
}

export default Home;
