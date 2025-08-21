import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const student = localStorage.getItem('student');
    const admin = localStorage.getItem('admin');
    const technician = localStorage.getItem('technician');

    if (student) {
      navigate('/student-dashboard');
    } else if (admin) {
      navigate('/admin-dashboard');
    } else if (technician) {
      navigate('/technician-dashboard'); 
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="home">
      {/* Welcome Section */}
      <section className="welcome-section">
        <div className="overlay">
          <h1>Welcome to FixMate</h1>
          <p>Your all-in-one portal for College/hostel maintenance and issue resolution.</p>
          <button className="primary" onClick={handleGetStarted}>
            Get Started
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="how-it-works">
        <h2>Why FixMate?</h2>
        <p>From complaint submission to resolution — everything’s tracked, transparent, and fast.</p>
        <div className="cards">
          <div className="card">
            <h3>📋 Raise Complaints</h3>
            <p>Quickly report issues with electricity, plumbing, cleaning, and more.</p>
          </div>
          <div className="card">
            <h3>📊 Real-Time Dashboard</h3>
            <p>Students, technicians, and admins get dedicated views to track and manage tickets.</p>
          </div>
          <div className="card">
            <h3>💬 Communication Ready</h3>
            <p>Seamless coordination between residents and hostel maintenance teams.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>Privacy Policy | Terms of Service | Contact Us</p>
        <p>©2024 FixMate. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
