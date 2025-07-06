import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // optional CSS

const StudentLogin = () => {
  const [roll, setRoll] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // ✅ Simple placeholder login logic
    if (roll === '123' && password === 'student') {
      localStorage.setItem('student', JSON.stringify({ roll }));
      navigate('/complaint');
    } else {
      alert('Invalid roll number or password');
    }
  };

  return (
    <div className="login-page">
      <h2>Student Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="text"
          placeholder="Roll Number"
          value={roll}
          onChange={(e) => setRoll(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default StudentLogin;
