import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TechLogin = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (id && password) {
      navigate('/tech-dashboard'); 
    } else {
      alert("Please enter ID and password.");
    }
  };

  return (
    <div className="login-container">
      <h2>Admin/Technician Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Employee ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default TechLogin;
