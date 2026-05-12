const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DB_PATH = path.join(__dirname, '../db/contacts.json');

function readContacts() {
  try { return JSON.parse(fs.readFileSync(DB_PATH, 'utf8')); } catch { return []; }
}

router.post('/', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const entry = {
    id: uuidv4(),
    name: name.trim(),
    email: email.trim(),
    subject: subject?.trim() || '',
    message: message.trim(),
    createdAt: new Date().toISOString(),
  };

  fs.writeFileSync(DB_PATH, JSON.stringify([...readContacts(), entry], null, 2));
  res.status(201).json({ message: "Message received. We'll get back to you within one business day." });
});

module.exports = router;
