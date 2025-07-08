import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

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

  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem('admin');
    if (!isAdmin) {
      navigate('/admin-login');
    } else {
      fetchComplaints();
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

  const handleLogout = () => {
    localStorage.removeItem('admin');
    navigate('/admin-login');
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
    } catch (err) {
      console.error('Failed to update complaint:', err);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="hamburger-menu" onClick={() => setSidebarOpen(!sidebarOpen)}>
        ☰
      </div>

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <h2>Admin Panel</h2>
        <nav>
          <ul>
            <li className="active">Dashboard</li>
            <li onClick={() => navigate('/admin/users')}>Users</li>
            <li>Settings</li>
            <li>Help</li>
          </ul>
        </nav>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </aside>

      <main className="dashboard-content">
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
            <input type="text" placeholder="Search complaints..." />
            <select><option>Status</option></select>
            <select><option>Category</option></select>
            <select><option>Date</option></select>
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
              {complaints.map(c => (
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
                    <input
                      value={edited[c._id]?.technician || ''}
                      onChange={(e) => handleChange(c._id, 'technician', e.target.value)}
                      placeholder="Assign technician"
                    />
                  </td>
                  <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td><button onClick={() => handleUpdate(c._id)}>Save</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
