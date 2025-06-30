const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./db');
const User = require('./user');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const Availability = require('./availability');
const Assignment = require('./assignment');
const Task = require('./task');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// JWT secret key (in production, use environment variable)
const SECRET_KEY = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

const DEFAULT_ASSIGNMENTS = [
  { title: 'Database Assignment', subject: 'Database', due: '2025-06-28', priority: 'High', status: 'Incomplete' },
  { title: 'Software Engineering Project', subject: 'Software Engineering', due: '2025-06-30', priority: 'Medium', status: 'Incomplete' },
  { title: 'Statistics Quiz', subject: 'Statistics', due: '2025-07-01', priority: 'Low', status: 'Complete' },
  { title: 'Operating Systems Homework', subject: 'Operating Systems', due: '2025-07-03', priority: 'High', status: 'Incomplete' },
  { title: 'Networks Lab', subject: 'Networks', due: '2025-07-05', priority: 'Medium', status: 'Incomplete' },
  { title: 'AI Project Proposal', subject: 'Artificial Intelligence', due: '2025-07-10', priority: 'High', status: 'Incomplete' },
  { title: 'Math Midterm', subject: 'Mathematics', due: '2025-07-12', priority: 'High', status: 'Incomplete' },
  { title: 'English Essay', subject: 'English', due: '2025-07-15', priority: 'Low', status: 'Incomplete' },
  { title: 'Database Presentation', subject: 'Database', due: '2025-07-18', priority: 'Medium', status: 'Incomplete' },
  { title: 'Software Engineering Final', subject: 'Software Engineering', due: '2025-07-20', priority: 'High', status: 'Incomplete' },
];

// API Routes
app.get('/api', (req, res) => {
  res.send('Hello from StudyFlow backend!');
});

app.post('/register', async (req, res) => {
  try {
    const { fullName, email, password, academicYear, major } = req.body;
    const user = await User.create({ fullName, email, password, academicYear, major });
    res.status(201).json({ message: 'User registered successfully!', user });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ error: 'Email already exists.' });
    } else {
      res.status(500).json({ error: 'Registration failed.' });
    }
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || user.password !== password) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, fullName: user.fullName },
      SECRET_KEY,
      { expiresIn: '2h' }
    );

    res.json({ message: `Login successful!`, token, user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed.' });
  }
});

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages format.' });
  }

  try {
    const openaiRes = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    res.json(openaiRes.data);
  } catch (err) {
    console.error('OpenAI proxy error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to connect to OpenAI.' });
  }
});

// Auth middleware
const authenticate = (req, res, next) => {
  const auth = req.headers['authorization'];
  if (!auth) return res.status(401).json({ error: 'No token provided.' });

  const token = auth.split(' ')[1];
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token.' });
    req.user = decoded;
    next();
  });
};

// Availability routes
app.get('/availability', authenticate, async (req, res) => {
  try {
    const slots = await Availability.findAll({ where: { userId: req.user.id } });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch availability.' });
  }
});

app.post('/availability', authenticate, async (req, res) => {
  try {
    const { day, start, end, best } = req.body;
    const slot = await Availability.create({ userId: req.user.id, day, start, end, best });
    res.status(201).json(slot);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add availability.' });
  }
});

app.put('/availability/:id', authenticate, async (req, res) => {
  try {
    const { day, start, end, best } = req.body;
    const slot = await Availability.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!slot) return res.status(404).json({ error: 'Slot not found.' });
    Object.assign(slot, { day, start, end, best });
    await slot.save();
    res.json(slot);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update availability.' });
  }
});

app.delete('/availability/:id', authenticate, async (req, res) => {
  try {
    const slot = await Availability.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!slot) return res.status(404).json({ error: 'Slot not found.' });
    await slot.destroy();
    res.json({ message: 'Deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete availability.' });
  }
});

// Assignment routes
app.get('/assignments', authenticate, async (req, res) => {
  try {
    let assignments = await Assignment.findAll({ where: { userId: req.user.id } });
    if (!assignments.length) {
      assignments = await Promise.all(
        DEFAULT_ASSIGNMENTS.map(a => Assignment.create({ ...a, userId: req.user.id }))
      );
    }
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch assignments.' });
  }
});

app.post('/assignments', authenticate, async (req, res) => {
  try {
    const { title, subject, due, priority, status } = req.body;
    const assignment = await Assignment.create({ userId: req.user.id, title, subject, due, priority, status });
    res.status(201).json(assignment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add assignment.' });
  }
});

app.put('/assignments/:id', authenticate, async (req, res) => {
  try {
    const assignment = await Assignment.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!assignment) return res.status(404).json({ error: 'Assignment not found.' });
    Object.assign(assignment, req.body);
    await assignment.save();
    res.json(assignment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update assignment.' });
  }
});

app.delete('/assignments/:id', authenticate, async (req, res) => {
  try {
    const assignment = await Assignment.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!assignment) return res.status(404).json({ error: 'Assignment not found.' });
    await assignment.destroy();
    res.json({ message: 'Deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete assignment.' });
  }
});

// Task routes
app.get('/tasks', authenticate, async (req, res) => {
  try {
    const tasks = await Task.findAll({ where: { userId: req.user.id }, order: [['order', 'ASC']] });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks.' });
  }
});

app.post('/tasks', authenticate, async (req, res) => {
  try {
    const { text, subject, dueDate, priority } = req.body;
    const maxOrder = await Task.max('order', { where: { userId: req.user.id } }) || 0;
    const task = await Task.create({ userId: req.user.id, text, subject, dueDate, priority, order: maxOrder + 1 });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add task.' });
  }
});

app.put('/tasks/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!task) return res.status(404).json({ error: 'Task not found.' });
    Object.assign(task, req.body);
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update task.' });
  }
});

app.delete('/tasks/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!task) return res.status(404).json({ error: 'Task not found.' });
    await task.destroy();
    res.json({ message: 'Deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete task.' });
  }
});

app.put('/tasks/reorder', authenticate, async (req, res) => {
  try {
    const { order } = req.body;
    for (const { id, order: newOrder } of order) {
      await Task.update({ order: newOrder }, { where: { id, userId: req.user.id } });
    }
    res.json({ message: 'Order updated.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reorder tasks.' });
  }
});

// Serve static frontend from client/build
app.use(express.static(path.join(__dirname, '../client/build')));

// Fallback route to React's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Connect to MySQL and start server
sequelize.authenticate()
  .then(() => console.log('✅ MySQL connected!'))
  .catch(err => console.error('❌ MySQL connection failed:', err));

sequelize.sync()
  .then(() => console.log('✅ Sequelize models synchronized!'))
  .catch(err => console.error('❌ Sequelize sync failed:', err));

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
