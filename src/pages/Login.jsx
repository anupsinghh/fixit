import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [role, setRole] = useState('student');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (role === 'student') {
      if (identifier === '123' && password === 'student') {
        localStorage.setItem('student', JSON.stringify({ roll: identifier }));
        localStorage.setItem('role', 'student');
        window.dispatchEvent(new Event('storage'));
        navigate('/complaint');
      } else {
        alert('Invalid student credentials');
      }
    } else if (role === 'technician') {
      if (identifier === 'tech001' && password === 'tech123') {
        localStorage.setItem('technician', JSON.stringify({ id: identifier }));
        localStorage.setItem('role', 'technician');
        window.dispatchEvent(new Event('storage'));
        navigate('/technician-dashboard'); 
      } else {
        alert('Invalid technician credentials');
      }
    } else if (role === 'admin') {
      if (identifier === 'admin@fixmate.com' && password === 'admin123') {
        localStorage.setItem('admin', true);
        localStorage.setItem('role', 'admin');
        window.dispatchEvent(new Event('storage'));
        navigate('/admin-dashboard');
      } else {
        alert('Invalid admin credentials');
      }
    } else if (role === 'manager') {
      if (identifier === 'manager001' && password === 'manager123') {
        localStorage.setItem('manager', JSON.stringify({ id: identifier }));
        localStorage.setItem('role', 'manager');
        window.dispatchEvent(new Event('storage'));
        navigate('/manager-dashboard');
      } else {
        alert('Invalid manager credentials');
      }
    }
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <label>
          Select Role:
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="technician">Technician</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        <label>
          {role === 'admin'
            ? 'Email'
            : role === 'student'
            ? 'Roll Number'
            : role === 'technician'
            ? 'Technician ID'
            : 'Manager ID'}
          :{' '}
          <input
            type={role === 'admin' ? 'email' : 'text'}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
        </label>

        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
