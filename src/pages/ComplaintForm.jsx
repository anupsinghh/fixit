import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ComplaintForm.css';

const ComplaintForm = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [room, setRoom] = useState('');
  const [student, setStudent] = useState(null);
  const [ticket, setTicket] = useState('');
  const [toast, setToast] = useState({ type: '', message: '' });

  useEffect(() => {
    const saved = localStorage.getItem('student');
    if (saved) {
      setStudent(JSON.parse(saved));
    } else {
      navigate('/student-login');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToast({ type: '', message: '' });
    setTicket('');

    const payload = {
      roll: student?.roll,
      category,
      room,
      description,
    };

    try {
      const res = await fetch('https://fixit-backend.onrender.com/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setTicket(data.ticket || '');
        setToast({ type: 'success', message: data.message || 'Complaint submitted successfully!' });
        setCategory('');
        setRoom('');
        setDescription('');
      } else {
        setToast({ type: 'error', message: data.error || 'Failed to submit complaint.' });
      }
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: 'Error submitting complaint. Please try again.' });
    }

    // Auto-hide the toast after 3.5 seconds
    setTimeout(() => {
      setToast({ type: '', message: '' });
    }, 3500);
  };

  return (
    <div className="complaint-form-page">
      <h2>Submit Complaint</h2>
      <p>Logged in as: <strong>{student?.roll}</strong></p>

      {/* ✅ Ticket on Top */}
      {ticket && (
        <div className="ticket-number-banner">
          🎫 Your Complaint Ticket: <strong>{ticket}</strong>
        </div>
      )}

      {/* ✅ Toast popup */}
      {toast.message && (
        <div className={`toast ${toast.type}`}>
          {toast.type === 'success' ? '✅' : '❌'} {toast.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="complaint-form">
        <label>
          Category:
          <select value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="">-- Select --</option>
            <option value="Electricity">Electricity</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Internet">Internet</option>
            <option value="Room Cleaning">Room Cleaning</option>
            <option value="Pest Control">Pest Control</option>
          </select>
        </label>

        <label>
          Room No:
          <input
            type="text"
            placeholder="Ex. Hostel-D 512"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            required
          />
        </label>

        <label>
          Description:
          <textarea
            placeholder="Describe the issue..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </label>

        <button type="submit">Submit Complaint</button>
      </form>
    </div>
  );
};

export default ComplaintForm;
