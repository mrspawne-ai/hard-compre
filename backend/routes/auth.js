const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const { requireAuth, JWT_SECRET } = require('../middleware/auth');

const DB_PATH = path.join(__dirname, '../db/users.json');
const ADMIN_EMAIL = 'admin@hardcompare.com';

function readUsers() {
  try { return JSON.parse(fs.readFileSync(DB_PATH, 'utf8')); } catch { return []; }
}
function writeUsers(users) {
  fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
}
function safeUser(u) {
  const { passwordHash, ...rest } = u;
  return rest;
}

// POST /api/auth/signup — regular users only, role is always 'user'
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });

  // Block registering with the reserved admin email
  if (email.toLowerCase() === ADMIN_EMAIL) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const users = readUsers();
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: uuidv4(),
    name: name?.trim() || email.split('@')[0],
    email: email.toLowerCase(),
    passwordHash,
    role: 'user',       // always 'user' — admin is seeded, never registered
    plan: 'Free',
    joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    status: 'active',
    createdAt: new Date().toISOString(),
  };

  writeUsers([...users, user]);
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ user: safeUser(user), token });
});

// POST /api/auth/signin
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  const users = readUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ user: safeUser(user), token });
});

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
  const user = readUsers().find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(safeUser(user));
});

// PATCH /api/auth/me — update name/email; admin cannot change email
router.patch('/me', requireAuth, (req, res) => {
  const { name, email } = req.body;
  const users = readUsers();
  const idx = users.findIndex(u => u.id === req.user.id);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });

  // Admin email is fixed — prevent lockout
  if (users[idx].role === 'admin' && email && email.toLowerCase() !== ADMIN_EMAIL) {
    return res.status(403).json({ error: 'Admin email address cannot be changed' });
  }

  if (email && email.toLowerCase() !== users[idx].email) {
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.id !== req.user.id)) {
      return res.status(409).json({ error: 'Email already in use' });
    }
  }

  users[idx] = {
    ...users[idx],
    ...(name?.trim() && { name: name.trim() }),
    ...(email && users[idx].role !== 'admin' && { email: email.toLowerCase() }),
  };
  writeUsers(users);
  res.json(safeUser(users[idx]));
});

module.exports = router;
