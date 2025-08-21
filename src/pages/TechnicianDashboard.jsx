import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TechnicianDashboard.css";

const technicianCategories = {
  Manish: ["Plumbing"],
  Aakash: ["Plumbing"],
  Rahul: ["Electricity"],
  Salman: ["Electricity"],
  Hitesh: ["Internet"],
  Rakesh: ["Internet"],
  Guddu: ["Room Cleaning"],
  Munna: ["Room Cleaning"],
  Sagar: ["Pest Control"],
  Jacky: ["Pest Control"],
};

const TechnicianDashboard = () => {
  const navigate = useNavigate();
  const [technician, setTechnician] = useState(null);
  const [assignedComplaints, setAssignedComplaints] = useState([]);
  const [allComplaints, setAllComplaints] = useState([]);
  const [editedStatus, setEditedStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState({});

  useEffect(() => {
    const savedTech = localStorage.getItem("technician");
    if (savedTech) {
      const tech = JSON.parse(savedTech);
      console.log("Logged in Technician:", tech);
      setTechnician(tech);
      fetchComplaints(tech.id); // Use id, not name
    } else {
      navigate("/technician-login");
    }
  }, [navigate]);

  const normalize = (str) => (str || "").trim().toLowerCase();

  const fetchComplaints = async (technicianId) => {
    setLoading(true);
    try {
      const res = await fetch("https://fixit-backend-kcce.onrender.com/api/complaints");
      const data = await res.json();

      const normTechId = normalize(technicianId);
      console.log("Filtering complaints for technician:", technicianId, "(normalized:", normTechId, ")");

      // Assigned complaints filter with normalization
      const assigned = data.filter((c) => normalize(c.technician) === normTechId);

      // Technician categories
      const categories = new Set(technicianCategories[technicianId] || []);

      // Open complaints unassigned but in technician's categories and pending/in progress
      const openRelevant = data.filter(
        (c) =>
          (!c.technician || normalize(c.technician) === "") &&
          categories.has(c.category) &&
          (c.status === "Pending" || c.status === "In Progress")
      );

      // Combine unique complaints
      const combinedMap = new Map();
      assigned.forEach((c) => combinedMap.set(c._id, c));
      openRelevant.forEach((c) => {
        if (!combinedMap.has(c._id)) combinedMap.set(c._id, c);
      });
      const combined = Array.from(combinedMap.values());

      setAssignedComplaints(assigned);
      setAllComplaints(combined);

      // Initialize editedStatus
      const statusMap = {};
      combined.forEach((c) => {
        statusMap[c._id] = c.status;
      });
      setEditedStatus(statusMap);
    } catch (e) {
      console.error("Failed to fetch complaints:", e);
    }
    setLoading(false);
  };

  const handleChange = (id, value) => {
    setEditedStatus((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSave = async (id) => {
    try {
      const status = editedStatus[id];
      await fetch(`https://fixit-backend-kcce.onrender.com/api/complaints/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setSaveStatus((prev) => ({ ...prev, [id]: "Saved" }));
      setTimeout(() => setSaveStatus((prev) => ({ ...prev, [id]: null })), 2000);
      if (technician) fetchComplaints(technician.id);
    } catch (e) {
      console.error("Error saving:", e);
      setSaveStatus((prev) => ({ ...prev, [id]: "Failed to save" }));
    }
  };

  const renderTable = (complaintsList, title) => {
    if (!complaintsList.length) return <p>No {title.toLowerCase()}.</p>;
    return (
      <>
        <h3>{title}</h3>
        <table className="complaints-table">
          <thead>
            <tr>
              <th>Ticket</th>
              <th>Category</th>
              <th>Location</th>
              <th>Description</th>
              <th>Status</th>
              <th>Date Submitted</th>
              <th>Save</th>
            </tr>
          </thead>
          <tbody>
            {complaintsList.map((c) => (
              <tr key={c._id}>
                <td>#{c.ticket}</td>
                <td>{c.category}</td>
                <td>{c.room}</td>
                <td>{c.description}</td>
                <td>
                  <select value={editedStatus[c._id]} onChange={(e) => handleChange(c._id, e.target.value)}>
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                  </select>
                </td>
                <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleSave(c._id)}>Save</button>
                  {saveStatus[c._id] && (
                    <span style={{ marginLeft: 10, color: saveStatus[c._id].toLowerCase().includes("fail") ? "red" : "green" }}>
                      {saveStatus[c._id]}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  };

  return (
    <div className="technician-dashboard" style={{ maxWidth: 900, margin: "2rem auto", padding: "0 1rem" }}>
      <header style={{ marginBottom: 24 }}>
        <h2>Technician Dashboard</h2>
        <p>
          Logged in as: <strong>{technician?.id}</strong>
        </p>
      </header>
      {loading ? (
        <p>Loading complaints...</p>
      ) : (
        <>
          {renderTable(assignedComplaints, "Assigned Complaints")}
          {renderTable(allComplaints, "All Relevant Complaints")}
        </>
      )}
    </div>
  );
};

export default TechnicianDashboard;
