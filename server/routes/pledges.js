const express = require('express');
const router = express.Router();
const db = require('../db/db');

const rateLimit = require('express-rate-limit');
const pledgeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  message: { error: 'Too many pledges. Please wait a minute.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// GET /api/pledges - Retrieve the 10 most recent pledges
router.get('/', (req, res) => {
  try {
    const pledges = db.prepare('SELECT id, name, pledge, created_at FROM pledges ORDER BY id DESC LIMIT 10').all();
    res.json(pledges);
  } catch (error) {
    console.error('Error fetching pledges:', error.message);
    res.status(500).json({ error: 'Failed to retrieve pledges' });
  }
});

// POST /api/pledges - Submit a new pledge with input sanitization and length limit
router.post('/', pledgeLimiter, (req, res) => {
  try {
    const { name, pledge } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'Name is required' });
    }

    if (!pledge || typeof pledge !== 'string') {
      return res.status(400).json({ error: 'Pledge is required' });
    }

    // Sanitize pledge text (XSS prevention) and trim
    const sanitizedPledge = pledge.replace(/<[^>]*>/g, '').trim();
    const sanitizedName = name.replace(/<[^>]*>/g, '').trim();

    if (sanitizedPledge === '') {
      return res.status(400).json({ error: 'Pledge content cannot be empty' });
    }

    if (sanitizedPledge.length > 120) {
      return res.status(400).json({ error: 'Pledge must be 120 characters or fewer' });
    }

    const profanityList = ['fgkfgv', 'fuck', 'shit', 'bitch', 'ass', 'spam', 'uhdsicff'];
    const hasProfanity = profanityList.some(word => sanitizedPledge.toLowerCase().includes(word));
    if (hasProfanity) {
      return res.status(400).json({ error: 'Please keep pledges clean and respectful.' });
    }

    // Insert into DB
    const trimmedName = sanitizedName.slice(0, 50);
    db.prepare('INSERT INTO pledges (name, pledge) VALUES (?, ?)').run(trimmedName, sanitizedPledge);

    res.status(201).json({ message: 'Pledge submitted successfully', pledge: { name: trimmedName, pledge: sanitizedPledge } });
  } catch (error) {
    console.error('Error saving pledge:', error.message);
    res.status(500).json({ error: 'Failed to save pledge' });
  }
});

module.exports = router;
