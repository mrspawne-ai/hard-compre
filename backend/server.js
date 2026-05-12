const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:4173'],
  credentials: true,
}));
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/models',  require('./routes/models'));
app.use('/api/guides',  require('./routes/guides'));
app.use('/api/faqs',    require('./routes/faqs'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/admin',   require('./routes/admin'));

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// ── Seed the single admin account on startup ──────────────────────────────────
// There is exactly ONE admin. It is created here if missing and can never be
// deleted or role-changed via the API.
const ADMIN_EMAIL    = 'admin@hardcompare.com';
const ADMIN_PASSWORD = 'admin123';

async function seedAdmin() {
  const USERS_PATH = path.join(__dirname, 'db/users.json');
  let users = [];
  try { users = JSON.parse(fs.readFileSync(USERS_PATH, 'utf8')); } catch { /**/ }

  // Remove any accidental duplicate admins, keep at most one
  const admins = users.filter(u => u.role === 'admin');
  if (admins.length > 1) {
    users = [admins[0], ...users.filter(u => u.role !== 'admin')];
    fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));
  }

  if (!users.find(u => u.role === 'admin')) {
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    users.push({
      id: uuidv4(),
      name: 'Admin',
      email: ADMIN_EMAIL,
      passwordHash,
      role: 'admin',
      plan: 'Pro',
      joinDate: 'January 2026',
      status: 'active',
      createdAt: new Date().toISOString(),
    });
    fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Admin account created');
    console.log(`  Email   : ${ADMIN_EMAIL}`);
    console.log(`  Password: ${ADMIN_PASSWORD}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }
}

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, async () => {
  await seedAdmin();
  console.log(`HardCompare API running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\nError: Port ${PORT} is already in use.`);
    console.error(`Run this to free it (Windows): for /f "tokens=5" %a in ('netstat -ano ^| findstr :${PORT}') do taskkill /PID %a /F`);
    console.error(`Or change the port: set PORT=3002 && npm run dev\n`);
    process.exit(1);
  }
  throw err;
});
