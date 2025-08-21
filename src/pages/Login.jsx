import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const technicians = {
  Plumbing: ['Manish', 'Aakash'],
  Electricity: ['Rahul', 'Salman'],
  Internet: ['Hitesh', 'Rakesh'],
  'Room Cleaning': ['Guddu', 'Munna'],
  'Pest Control': ['Sagar', 'Jacky'],
};

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Determine role by credentials
    let role = null;
    if (identifier === 'User' && password === '12345') {
      role = 'user';
      localStorage.setItem('student', JSON.stringify({ roll: identifier }));
      localStorage.setItem('role', 'user');
      window.dispatchEvent(new Event('storage'));
      navigate('/student-dashboard');
      return;
    }
    let validTech = false;
    Object.values(technicians).forEach(techList => {
      if (techList.includes(identifier)) validTech = true;
    });
    if (validTech && password === 'tech123') {
      role = 'technician';
      localStorage.setItem('technician', JSON.stringify({ id: identifier }));
      localStorage.setItem('role', 'technician');
      window.dispatchEvent(new Event('storage'));
      navigate('/technician-dashboard');
      return;
    }
    if (identifier === 'admin@fixmate.com' && password === 'admin123') {
      role = 'admin';
      localStorage.setItem('admin', true);
      localStorage.setItem('role', 'admin');
      window.dispatchEvent(new Event('storage'));
      navigate('/admin-dashboard');
      return;
    }
    if (identifier === 'manager001' && password === 'manager123') {
      role = 'manager';
      localStorage.setItem('manager', JSON.stringify({ id: identifier }));
      localStorage.setItem('role', 'manager');
      window.dispatchEvent(new Event('storage'));
      navigate('/manager-dashboard');
      return;
    }
    alert('Invalid credentials');
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Login</h2>

        <label>
          ID:
          <input
            type="text"
            value={identifier}
            onChange={e => setIdentifier(e.target.value)}
            required
          />
        </label>

        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </label>

        <button type="submit">Login</button>
      </form>

      <div className="credentials-panel">
        <h3>Testing Credentials</h3>

        <div className="credential-section">
          <strong>Users (Students & Faculties)</strong>
          <p>ID: <code>User</code></p>
          <p>Password: <code>12345</code></p>
        </div>

        <div className="credential-section">
          <strong>Technicians (Password: <code>tech123</code>)</strong>
          {Object.entries(technicians).map(([dept, techList]) => (
            <div key={dept} className="tech-group">
              <em>{dept}:</em>
              <p>{techList.join(', ')}</p>
            </div>
          ))}
        </div>

        <div className="credential-section">
          <strong>Admins</strong>
          <p>ID: <code>admin@fixmate.com</code></p>
          <p>Password: <code>admin123</code></p>
        </div>

        <div className="credential-section">
          <strong>Managers</strong>
          <p>ID: <code>manager001</code></p>
          <p>Password: <code>manager123</code></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
