import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [activeComplaint, setActiveComplaint] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('student');
    if (saved) {
      const stu = JSON.parse(saved);
      setStudent(stu);

      fetch(`https://fixit-backend-kcce.onrender.com/api/complaints`)
        .then(res => res.json())
        .then(data => {
          const myComplaints = data.filter(c => c.roll === stu.roll);
          setComplaints(myComplaints);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      navigate('/student-login');
    }
  }, [navigate]);

  const handleFeedbackChange = (id, field, value) => {
    setFeedbacks(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const handleOpenModal = (complaint) => {
    setActiveComplaint(complaint);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setActiveComplaint(null);
  };

  // Compact feedback: Yes (satisfied) or No (not satisfied, with comment)
  const handleSubmitFeedback = async (id, satisfiedOnly = false) => {
  let feedback;
  if (satisfiedOnly) {
    feedback = { satisfied: true, comment: '' }; // explicit satisfied true
  } else {
    feedback = feedbacks[id] || {};
    feedback.satisfied = false; // <-- explicitly set false for "No"
    // Optionally ensure 'comment' field is a string even if empty
    if (!('comment' in feedback)) feedback.comment = '';
  }

  if (!feedback) return;

  try {
    await fetch(`https://fixit-backend-kcce.onrender.com/api/complaints/${id}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(feedback),
    });
    alert("Feedback submitted successfully!");
    handleCloseModal();
    setFeedbacks(prev => ({
      ...prev,
      [id]: feedback
    }));
  } catch (err) {
    console.error("Error submitting feedback:", err);
    alert("Failed to submit feedback.");
  }
};


  return (
    <div className="student-dashboard">
      <header>
        <h2>My Complaints</h2>
        <div>
          <span>Logged in as: <strong>{student?.roll}</strong></span>
        </div>
      </header>

      <button
        className="new-complaint-btn"
        onClick={() => navigate('/complaint')}
      >
        + New Complaint
      </button>

      {loading ? (
        <div className="loading">Loading your complaints...</div>
      ) : complaints.length === 0 ? (
        <div className="no-complaints">No complaints submitted yet.</div>
      ) : (
        <table className="complaints-table">
          <thead>
            <tr>
              <th>Ticket</th>
              <th>Category</th>
              <th>Location</th>
              <th>Description</th>
              <th>Status</th>
              <th>Technician</th>
              <th>Date</th>
              <th className="feedback-col">Feedback</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map(c => (
              <tr key={c._id}>
                <td>#{c.ticket || '—'}</td>
                <td>{c.category}</td>
                <td>{c.room}</td>
                <td>{c.description}</td>
                <td>
                  <span className={`status ${c.status.toLowerCase().replace(' ', '-')}`}>
                    {c.status}
                  </span>
                </td>
                <td>{c.technician || '—'}</td>
                <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                <td className="feedback-col">
                  {c.status === "Resolved" ? (
                    <div className="compact-feedback-yn">
                      <span>Satisfied?</span>
                      <button
                        className="yn-btn yes-btn"
                        title="Yes"
                        onClick={() => handleSubmitFeedback(c._id, true)}
                      >
                        Yes
                      </button>
                      <button
                        className="yn-btn no-btn"
                        title="No"
                        onClick={() => handleOpenModal(c)}
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <span>—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* --- Minimal Modal For 'No' --- */}
      {showModal && activeComplaint && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Why not satisfied with Ticket #{activeComplaint.ticket}?</h3>
            <textarea
              placeholder="Please describe the issue..."
              value={feedbacks[activeComplaint._id]?.comment || ""}
              onChange={e =>
                handleFeedbackChange(activeComplaint._id, "comment", e.target.value)
              }
            />
            <div className="modal-actions">
              <button
                className="submit-btn"
                onClick={() => handleSubmitFeedback(activeComplaint._id, false)}
              >
                Submit
              </button>
              <button className="cancel-btn" onClick={handleCloseModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
