const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const { requireAdmin } = require('../middleware/auth');
const { ALL_MODELS } = require('../data/seed');

const USERS_PATH = path.join(__dirname, '../db/users.json');
const CONTACTS_PATH = path.join(__dirname, '../db/contacts.json');

const ADMIN_EMAIL = 'admin@hardcompare.com';

function readUsers() {
  try { return JSON.parse(fs.readFileSync(USERS_PATH, 'utf8')); } catch { return []; }
}
function writeUsers(users) {
  fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));
}
function safeUser(u) {
  const { passwordHash, ...rest } = u;
  return rest;
}

// GET /api/admin/stats
router.get('/stats', requireAdmin, (req, res) => {
  const users = readUsers();
  const regularUsers = users.filter(u => u.role !== 'admin');
  let contacts = [];
  try { contacts = JSON.parse(fs.readFileSync(CONTACTS_PATH, 'utf8')); } catch { /**/ }

  const now = new Date();
  const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

  res.json({
    totalUsers: regularUsers.length,
    activeUsers: regularUsers.filter(u => u.status === 'active').length,
    newUsersThisMonth: regularUsers.filter(u => new Date(u.createdAt) > monthAgo).length,
    totalModels: ALL_MODELS.length,
    totalContacts: contacts.length,
    pendingContacts: contacts.filter(c => !c.resolved).length,
  });
});

// GET /api/admin/users — returns only regular users (not the admin account)
router.get('/users', requireAdmin, (req, res) => {
  const { q } = req.query;
  let users = readUsers().filter(u => u.role !== 'admin').map(safeUser);
  if (q) {
    const lower = q.toLowerCase();
    users = users.filter(u =>
      u.name.toLowerCase().includes(lower) || u.email.toLowerCase().includes(lower)
    );
  }
  res.json(users);
});

// PATCH /api/admin/users/:id
router.patch('/users/:id', requireAdmin, (req, res) => {
  const users = readUsers();
  const idx = users.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });

  // Protect the admin account from any changes via this endpoint
  if (users[idx].role === 'admin') {
    return res.status(403).json({ error: 'The admin account cannot be modified here' });
  }

  const { name, email, status } = req.body;
  // role is intentionally excluded — no one can be promoted/demoted
  users[idx] = {
    ...users[idx],
    ...(name && { name }),
    ...(email && { email }),
    ...(status && { status }),
  };
  writeUsers(users);
  res.json(safeUser(users[idx]));
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', requireAdmin, (req, res) => {
  const users = readUsers();
  const target = users.find(u => u.id === req.params.id);
  if (!target) return res.status(404).json({ error: 'User not found' });

  // Protect the admin account from deletion
  if (target.role === 'admin') {
    return res.status(403).json({ error: 'The admin account cannot be deleted' });
  }

  writeUsers(users.filter(u => u.id !== req.params.id));
  res.json({ message: 'User removed' });
});

// GET /api/admin/products
router.get('/products', requireAdmin, (req, res) => {
  res.json(ALL_MODELS.map(m => ({
    id: m.id,
    name: m.name,
    brand: m.brand,
    category: m.category,
    subtype: m.subtype,
    price: m.price,
    priceLabel: m.priceLabel,
    releaseYear: m.releaseYear,
    performanceScore: m.performanceScore,
    status: 'active',
  })));
});

// GET /api/admin/contacts
router.get('/contacts', requireAdmin, (req, res) => {
  try {
    const contacts = JSON.parse(fs.readFileSync(CONTACTS_PATH, 'utf8'));
    res.json(contacts);
  } catch {
    res.json([]);
  }
});

module.exports = router;
