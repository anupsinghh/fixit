import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const technicianData = {
  Plumbing: ['Manish', 'Aakash'],
  Electricity: ['Rahul', 'Salman'],
  Internet: ['Hitesh', 'Rakesh'],
  'Room Cleaning': ['Guddu', 'Munna'],
  'Pest Control': ['Sagar', 'Jacky'],
};

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [edited, setEdited] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    byCategory: {},
    total: 0,
    resolved: 0,
    pending: 0,
  });
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [saveStatus, setSaveStatus] = useState({});
  const [showFeedbackTab, setShowFeedbackTab] = useState(false);

  // filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const navigate = useNavigate();
  const cutoffTime = Date.now() - 24 * 60 * 60 * 1000;

  useEffect(() => {
    const isAdmin = localStorage.getItem('admin');
    const isManager = localStorage.getItem('manager');
    if (!isAdmin && !isManager) {
      navigate('/admin-login');
    } else {
      fetchComplaints();
      fetchNotifications();
    }
  }, [navigate]);

  useEffect(() => {
    document.body.classList.toggle('sidebar-open', sidebarOpen);
  }, [sidebarOpen]);

  const fetchComplaints = () => {
    fetch('https://fixit-backend-kcce.onrender.com/api/complaints')
      .then(res => res.json())
      .then(data => {
        setComplaints(data);
        const byCategory = {};
        let resolved = 0;
        let pending = 0;
        data.forEach(c => {
          byCategory[c.category] = (byCategory[c.category] || 0) + 1;
          if (c.status === 'Resolved') resolved++;
          else pending++;
        });
        setStats({
          byCategory,
          total: data.length,
          resolved,
          pending,
        });
        const init = {};
        data.forEach(c => {
          init[c._id] = {
            status: c.status,
            technician: c.technician || ''
          };
        });
        setEdited(init);
      })
      .catch(err => console.error('Failed to fetch complaints:', err));
  };

  const fetchNotifications = () => {
    setLoadingNotifications(true);
    fetch('https://fixit-backend-kcce.onrender.com/api/notifications')
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(n => {
          const notifDate = new Date(n.createdAt).getTime();
          return !n.read && notifDate > cutoffTime;
        });
        setNotifications(filtered);
        setLoadingNotifications(false);
      })
      .catch(err => {
        console.error('Failed to fetch notifications:', err);
        setLoadingNotifications(false);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('admin');
    localStorage.removeItem('manager');
    localStorage.removeItem('role');
    navigate('/');
  };

  const handleChange = (id, field, value) => {
    setEdited(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const handleUpdate = async (id) => {
    try {
      const { status, technician } = edited[id];
      await fetch(`https://fixit-backend-kcce.onrender.com/api/complaints/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, technician })
      });
      fetchComplaints();
      setSaveStatus(prev => ({ ...prev, [id]: 'Saved successfully!' }));
      setTimeout(() => {
        setSaveStatus(prev => ({ ...prev, [id]: null }));
      }, 3000);
    } catch (err) {
      console.error('Failed to update complaint:', err);
      setSaveStatus(prev => ({ ...prev, [id]: 'Failed to save.' }));
    }
  };

  const handleReopen = async (complaintId) => {
    if (!window.confirm('Are you sure you want to reopen this complaint?')) return;
    try {
      await fetch(`https://fixit-backend-kcce.onrender.com/api/complaints/${complaintId}/reopen`, {
        method: 'POST',
      });
      await fetch(`https://fixit-backend-kcce.onrender.com/api/notifications/${complaintId}/read`, {
        method: 'PUT',
      });

      fetchComplaints();
      fetchNotifications();
      alert('Complaint reopened successfully');
    } catch (err) {
      console.error('Failed to reopen complaint:', err);
      alert('Error reopening complaint');
    }
  };

  const toggleFeedbackTab = () => {
    setShowFeedbackTab(!showFeedbackTab);
  };

  // apply filters
  const filteredComplaints = complaints.filter(c => {
    const matchesSearch =
      c.ticket?.toString().includes(searchTerm) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus ? c.status === filterStatus : true;
    const matchesCategory = filterCategory ? c.category === filterCategory : true;
    const matchesDate = filterDate
      ? new Date(c.createdAt).toLocaleDateString() ===
        new Date(filterDate).toLocaleDateString()
      : true;

    return matchesSearch && matchesStatus && matchesCategory && matchesDate;
  });

  return (
    <div className="admin-dashboard">
      <div className="hamburger-menu" onClick={() => setSidebarOpen(!sidebarOpen)}>
        ☰
      </div>
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <h2>{localStorage.getItem('admin') ? 'Admin Panel' : 'Manager Panel'}</h2>
        <nav>
          <ul>
            <li
              className={!showFeedbackTab ? 'active' : ''}
              onClick={() => setShowFeedbackTab(false)}
            >
              Dashboard
            </li>
            <li
              onClick={toggleFeedbackTab}
              style={{ cursor: 'pointer' }}
              className={showFeedbackTab ? 'active' : ''}
            >
              Feedback {notifications.length > 0 && `(${notifications.length})`}
            </li>
            <li
              style={localStorage.getItem('manager') ? { display: 'none' } : {}}
              onClick={() => navigate('/admin/users')}
            >
              Users
            </li>
            <li>Settings</li>
            <li>Help</li>
          </ul>
        </nav>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </aside>
      <main className="dashboard-content">
        {!showFeedbackTab && (
          <>
            <h1>Complaints Overview</h1>
            <section className="stats">
              <div className="stat-card">
                <h3>Complaints by Category</h3>
                {Object.entries(stats.byCategory).map(([cat, count]) => (
                  <p key={cat}><strong>{cat}</strong>: {count}</p>
                ))}
              </div>
              <div className="stat-card">
                <h3>Complaint Resolution</h3>
                <p>Total: <strong>{stats.total}</strong></p>
                <p>Resolved: <strong>{stats.resolved}</strong></p>
                <p>Pending: <strong>{stats.pending}</strong></p>
                <p>Resolution Rate: <strong>{Math.round((stats.resolved / stats.total) * 100 || 0)}%</strong></p>
              </div>
            </section>
            <section className="complaint-list">
              <h2>Current Complaints</h2>
              <div className="filters">
                <input
                  type="text"
                  placeholder="Search complaints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
                <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                  <option value="">All Categories</option>
                  {Object.keys(technicianData).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Ticket</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Technician</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComplaints.map(c => {
                    const techsForCategory = technicianData[c.category] || [];
                    return (
                      <tr key={c._id}>
                        <td>#{c.ticket || '—'}</td>
                        <td>{c.category}</td>
                        <td>
                          <select
                            value={edited[c._id]?.status || 'Pending'}
                            onChange={(e) => handleChange(c._id, 'status', e.target.value)}
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                        </td>
                        <td>
                          <select
                            value={edited[c._id]?.technician || ''}
                            onChange={(e) => handleChange(c._id, 'technician', e.target.value)}
                          >
                            <option value="">-- Select Technician --</option>
                            {techsForCategory.map(name => (
                              <option key={name} value={name}>{name}</option>
                            ))}
                          </select>
                        </td>
                        <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                        <td>
                          <button onClick={() => handleUpdate(c._id)}>Save</button>
                          {saveStatus[c._id] && (
                            <span style={{ marginLeft: '10px', color: saveStatus[c._id].includes('Failed') ? 'red' : 'green' }}>
                              {saveStatus[c._id]}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          </>
        )}

        {showFeedbackTab && (
          <section className="notifications-section" style={{ marginTop: '3rem' }}>
            <h2>Unsatisfied Feedback Notifications</h2>
            {loadingNotifications ? (
              <p>Loading notifications...</p>
            ) : notifications.length === 0 ? (
              <p>No unsatisfied feedback notifications.</p>
            ) : (
              <table className="notifications-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th>Ticket</th>
                    <th>Name</th>
                    <th>Comment</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map(notif => {
                    const complaint = complaints.find(c => c._id === notif.complaintId);
                    const isReopened = complaint && complaint.status !== 'Resolved';
                    return (
                      <tr key={notif._id} style={{ borderBottom: '1px solid #ddd' }}>
                        <td>#{notif.ticket}</td>
                        <td>{notif.studentRoll}</td>
                        <td>{notif.comment || '—'}</td>
                        <td>{new Date(notif.createdAt).toLocaleString()}</td>
                        <td>{isReopened ? 'Reopened ✅' : 'Pending'}</td>
                        <td>
                          {!isReopened ? (
                            <button
                              style={{
                                padding: '0.4rem 0.9rem',
                                borderRadius: '6px',
                                border: 'none',
                                backgroundColor: '#0d6efd',
                                color: 'white',
                                cursor: 'pointer',
                                fontWeight: '600',
                              }}
                              onClick={() => handleReopen(notif.complaintId)}
                            >
                              Reopen
                            </button>
                          ) : (
                            <span style={{ color: 'green', fontWeight: '600' }}>Already reopened</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
