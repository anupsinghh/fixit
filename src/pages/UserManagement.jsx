import React, { useState, useEffect } from 'react';
import './UserManagement.css';

const UserManagement = () => {
  const [students, setStudents] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  const [studentForm, setStudentForm] = useState({ name: '', roll: '', department: '', contact: '' });
  const [technicianForm, setTechnicianForm] = useState({ name: '', id: '', specialization: '', contact: '' });

  useEffect(() => {
    fetch('http://localhost:5000/api/users')
      .then(res => res.json())
      .then(data => {
        setStudents(data.filter(u => u.role === 'student'));
        setTechnicians(data.filter(u => u.role === 'technician'));
      })
      .catch(err => console.error('Failed to fetch users:', err));
  }, []);

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...studentForm, role: 'student' };

    const res = await fetch('http://localhost:5000/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (res.ok) {
      setStudents(prev => [...prev, data]);
      setStudentForm({ name: '', roll: '', department: '', contact: '' });
      showSuccess('✅ Student added successfully!');
    } else {
      alert(data.error || 'Failed to add student');
    }
  };

  const handleTechnicianSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...technicianForm, role: 'technician' };

    const res = await fetch('http://localhost:5000/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (res.ok) {
      setTechnicians(prev => [...prev, data]);
      setTechnicianForm({ name: '', id: '', specialization: '', contact: '' });
      showSuccess('✅ Technician added successfully!');
    } else {
      alert(data.error || 'Failed to add technician');
    }
  };

  return (
    <div className="user-management-page">
      <h2>User Management</h2>
      <p>Add new students and technicians to the system.</p>

      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      <div className="form-section">
        <h3>Add New Student</h3>
        <form onSubmit={handleStudentSubmit}>
          <input
            type="text"
            placeholder="Enter student's full name"
            value={studentForm.name}
            onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Enter student's ID number"
            value={studentForm.roll}
            onChange={(e) => setStudentForm({ ...studentForm, roll: e.target.value })}
            required
          />
          <select
            value={studentForm.department}
            onChange={(e) => setStudentForm({ ...studentForm, department: e.target.value })}
            required
          >
            <option value="">Select department</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="MECH">MECH</option>
          </select>
          <input
            type="text"
            placeholder="Enter email or phone number"
            value={studentForm.contact}
            onChange={(e) => setStudentForm({ ...studentForm, contact: e.target.value })}
            required
          />
          <button type="submit">Add Student</button>
        </form>
      </div>

      <div className="form-section">
        <h3>Add New Technician</h3>
        <form onSubmit={handleTechnicianSubmit}>
          <input
            type="text"
            placeholder="Enter technician's full name"
            value={technicianForm.name}
            onChange={(e) => setTechnicianForm({ ...technicianForm, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Enter technician's ID number"
            value={technicianForm.id}
            onChange={(e) => setTechnicianForm({ ...technicianForm, id: e.target.value })}
            required
          />
          <select
            value={technicianForm.specialization}
            onChange={(e) => setTechnicianForm({ ...technicianForm, specialization: e.target.value })}
            required
          >
            <option value="">Select specialization</option>
            <option value="Electrician">Electrician</option>
            <option value="Plumber">Plumber</option>
            <option value="Internet">Internet</option>
          </select>
          <input
            type="text"
            placeholder="Enter email or phone number"
            value={technicianForm.contact}
            onChange={(e) => setTechnicianForm({ ...technicianForm, contact: e.target.value })}
            required
          />
          <button type="submit">Add Technician</button>
        </form>
      </div>
    </div>
  );
};

export default UserManagement;