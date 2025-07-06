const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/fixmate', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Complaint Schema
const complaintSchema = new mongoose.Schema({
  roll: String,
  category: String,
  room: String,
  description: String,
  ticket: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  technician: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});
const Complaint = mongoose.model('Complaint', complaintSchema);

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  roll: String,              // for students
  department: String,        // for students
  id: String,                // for technicians
  specialization: String,    // for technicians
  contact: { type: String, required: true },
  role: { type: String, enum: ['student', 'technician'], required: true }
});
const User = mongoose.model('User', userSchema);

// ----------------- Complaint Routes ------------------

// GET all complaints
app.get('/api/complaints', async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});

// POST new complaint with ticket number
app.post('/api/complaints', async (req, res) => {
  try {
    const ticket = `TKT-${Date.now().toString(36).toUpperCase()}`;
    const complaint = new Complaint({ ...req.body, ticket });
    await complaint.save();
    res.status(201).json({ message: 'Complaint submitted successfully!', ticket });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error saving complaint.' });
  }
});

// PUT update complaint (status or technician)
app.put('/api/complaints/:id', async (req, res) => {
  try {
    const { status, technician } = req.body;
    await Complaint.findByIdAndUpdate(req.params.id, { status, technician });
    res.json({ message: 'Complaint updated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating complaint.' });
  }
});

// ------------------- User Routes ---------------------

// GET all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST new user (student or technician)
app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    console.error('User creation failed:', err);
    res.status(500).json({ error: 'Failed to save user' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
