import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import './Layout.css';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Refresh role on navigation
  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    setRole(storedRole || null);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.clear(); // clears student/admin/technician/role
    setRole(null);
    navigate('/');
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-left">
          <div className="logo" onClick={() => handleNavigate('/')}>FixMate</div>
        </div>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <button onClick={() => handleNavigate('/')}>Home</button>

          {role === 'user' && (
            <button onClick={() => handleNavigate('/student-dashboard')}>Dashboard</button>
          )}

          {role === 'technician' && (
            <button onClick={() => handleNavigate('/technician-dashboard')}>Dashboard</button>
          )}
          {role === 'manager' && (
            <button onClick={() => handleNavigate('/manager-dashboard')}>Dashboard</button>
          )}
          {role === 'admin' && (
            <button onClick={() => handleNavigate('/admin-dashboard')}>Dashboard</button>
          )}

          {!role ? (
            <button onClick={() => handleNavigate('/login')}>Login</button>
          ) : (
            <button onClick={handleLogout}>Logout</button>
          )}
        </div>

        <div
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div />
          <div />
          <div />
        </div>
      </nav>

      <Outlet />
    </>
  );
};

export default Layout;
