const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const sequelize = require('./db');
const Availability = require('./availability');
const Assignment = require('./assignment');
const User = require('./user');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET = 'my-secret-key';

app.use(cors());
app.use(express.json());

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token required' });

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Sync DB and start server
sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});

// Auth Routes
app.post('/register', async (req, res) => {
  try {
  const { fullName, email, password, academicYear, major } = req.body;
    if (!fullName || !email || !password || !academicYear || !major) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
    return res.status(400).json({ error: 'Email already exists' });
  }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ fullName, email, password: hashedPassword, academicYear, major });
  res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/login', async (req, res) => {
  try {
  const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }
    const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '1h' });
  res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Availability Routes
app.get('/availability', authenticateToken, async (req, res) => {
  try {
    const slots = await Availability.findAll({ where: { userId: req.user.id } });
    res.json(slots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
});

app.post('/availability', authenticateToken, async (req, res) => {
  try {
    const { day, start, end, best } = req.body;
    if (!day || !start || !end) return res.status(400).json({ error: 'Missing required fields' });

    const newSlot = await Availability.create({
      userId: req.user.id,
      day,
      start,
      end,
      best: !!best,
    });

    res.status(201).json(newSlot);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create availability' });
  }
});

app.put('/availability/:id', authenticateToken, async (req, res) => {
  try {
    const slot = await Availability.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!slot) return res.status(404).json({ error: 'Slot not found' });

    const { day, start, end, best } = req.body;
    if (!day || !start || !end) return res.status(400).json({ error: 'Missing required fields' });

    slot.day = day;
    slot.start = start;
    slot.end = end;
    slot.best = !!best;
    await slot.save();

    res.json(slot);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update availability' });
  }
});

app.delete('/availability/:id', authenticateToken, async (req, res) => {
  try {
    const deleted = await Availability.destroy({ where: { id: req.params.id, userId: req.user.id } });
    if (!deleted) return res.status(404).json({ error: 'Slot not found' });
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete availability' });
  }
});

// Assignment Routes
app.get('/assignments', authenticateToken, async (req, res) => {
  try {
    const assignments = await Assignment.findAll({ where: { userId: req.user.id } });
    res.json(assignments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

app.post('/assignments', authenticateToken, async (req, res) => {
  try {
    const { title, subject, due, priority, status } = req.body;
    if (!title || !subject || !due || !priority || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const assignment = await Assignment.create({
      userId: req.user.id,
      title,
      subject,
      due,
      priority,
      status,
    });
    res.status(201).json(assignment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create assignment' });
  }
});

app.put('/assignments/:id', authenticateToken, async (req, res) => {
  try {
    const assignment = await Assignment.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
    const { title, subject, due, priority, status } = req.body;
    assignment.title = title;
    assignment.subject = subject;
    assignment.due = due;
    assignment.priority = priority;
    assignment.status = status;
    await assignment.save();
    res.json(assignment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update assignment' });
  }
});

app.delete('/assignments/:id', authenticateToken, async (req, res) => {
  try {
    const deleted = await Assignment.destroy({ where: { id: req.params.id, userId: req.user.id } });
    if (!deleted) return res.status(404).json({ error: 'Assignment not found' });
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete assignment' });
  }
});
