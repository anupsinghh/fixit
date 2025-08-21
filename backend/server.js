// backend.js - Fully integrated backend with feedback and notifications support

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Allowed origins for CORS (production + local dev)
const allowedOrigins = [
  'https://fixeet.vercel.app',  // Production frontend
  'http://localhost:3000',        // Local React dev
  'http://localhost:3001',        // Local frontend alternate
];

// Middleware to handle CORS with dynamic origin
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: Origin ${origin} not allowed.`));
    }
  },
  methods: ['GET', 'POST', 'PUT'],
  credentials: true,
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
  createdAt: { type: Date, default: Date.now },
  feedback: {
    satisfied: { type: Boolean, default: null },  // null = not submitted yet
    comment: { type: String, default: '' }
  }
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

// Notification Schema
const notificationSchema = new mongoose.Schema({
  type: { type: String, enum: ['feedback'], default: 'feedback' },
  complaintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', required: true },
  ticket: { type: String, required: true },
  studentRoll: { type: String, required: true },
  comment: { type: String, default: '' },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
const Notification = mongoose.model('Notification', notificationSchema);

// ----------------- Complaint Routes ------------------

// Get all complaints
app.get('/api/complaints', async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});

// Submit new complaint
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

// Update complaint (Admin)
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

// Submit feedback for a complaint (student)
app.post('/api/complaints/:id/feedback', async (req, res) => {
  try {
    const { satisfied, comment } = req.body;

    // Update only feedback part of the complaint
    const updated = await Complaint.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          'feedback.satisfied': satisfied,
          'feedback.comment': comment
        }
      },
      { new: true }
    );

    // Create notification if feedback is "Not Satisfied"
    if (updated && satisfied === false) {
      await Notification.create({
        complaintId: updated._id,
        ticket: updated.ticket,
        studentRoll: updated.roll,
        comment: comment || ''
      });
    }

    res.json(updated);
  } catch (err) {
    console.error('Feedback submission error:', err);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// ----------------- Notification Routes ----------------

// Get all notifications (admin)
app.get('/api/notifications', async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    console.error('Failed to fetch notifications:', err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark notification as read
app.put('/api/notifications/:id/read', async (req, res) => {
  try {
    const item = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.json(item);
  } catch (err) {
    console.error('Notification update error:', err);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// Reopen complaint (admin or from notification)
app.post('/api/complaints/:id/reopen', async (req, res) => {
  try {
    const reopened = await Complaint.findByIdAndUpdate(
      req.params.id,
      {
        status: 'In Progress',
        'feedback.satisfied': null,
        'feedback.comment': ''
      },
      { new: true }
    );
    res.json(reopened);
  } catch (err) {
    console.error('Reopen error:', err);
    res.status(500).json({ error: 'Failed to reopen complaint' });
  }
});

// ----------------- User Routes ------------------------

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

// ----------------- Start Server -----------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
