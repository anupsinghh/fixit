import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleStudentClick = () => {
    navigate('/student-login');
  };

  const handleAdminClick = () => {
    navigate('/admin-login'); // You can create this page later
  };

  return (
    <div className="home">
      {/* Welcome Section */}
      <section className="welcome-section">
        <div className="overlay">
          <h1>Welcome to FixMate</h1>
          <p>Your one-stop solution for managing hostel complaints efficiently.</p>
          <div className="button-group">
            <button className="primary" onClick={handleStudentClick}>
              Student
            </button>
            <button className="secondary" onClick={handleAdminClick}>
              Admin/Technician
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2>How FixMate Works</h2>
        <p>Our system streamlines the complaint process, ensuring quick and effective resolution.</p>
        <div className="cards">
          <div className="card">
            <h3>📋 Submit a Complaint</h3>
            <p>Students can easily submit complaints through a user-friendly interface.</p>
          </div>
          <div className="card">
            <h3>⏱️ Track Progress</h3>
            <p>Track the status of your complaint in real-time, from submission to resolution.</p>
          </div>
          <div className="card">
            <h3>💬 Get Support</h3>
            <p>Our dedicated team is available to assist with any issues or questions you may have.</p>
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
