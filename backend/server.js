require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors({
  origin: 'https://fixeet.vercel.app', // replace with your deployed frontend URL
  methods: ['GET', 'POST', 'PUT'],
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('MongoDB connection error:', err));

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
  roll: String,
  department: String,
  id: String,
  specialization: String,
  contact: { type: String, required: true },
  role: { type: String, enum: ['student', 'technician'], required: true }
});
const User = mongoose.model('User', userSchema);

// ----------------- Complaint Routes ------------------

app.get('/api/complaints', async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});

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

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

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
  console.log(`Server running on port ${PORT}`);
});
