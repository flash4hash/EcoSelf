const express = require('express');
const router = express.Router();
const db = require('../db/db');

// GET /api/leaderboard - Get top 10 leaderboard entries
router.get('/', (req, res) => {
  try {
    const scores = db.prepare('SELECT id, name, score, is_mock FROM leaderboard ORDER BY score DESC LIMIT 10').all();
    res.json(scores);
  } catch (error) {
    console.error('Error fetching leaderboard:', error.message);
    res.status(500).json({ error: 'Failed to retrieve leaderboard' });
  }
});

// POST /api/leaderboard - Submit or update user score
router.post('/', (req, res) => {
  try {
    const { name, score } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'Name is required' });
    }

    if (score === undefined || typeof score !== 'number') {
      return res.status(400).json({ error: 'Score must be a number' });
    }

    const sanitizedName = name.replace(/<[^>]*>/g, '').trim();

    // Check if the user already exists in the leaderboard
    // First remove old entry if exists for this name to prevent duplicates
    db.prepare('DELETE FROM leaderboard WHERE name = ?').run(sanitizedName);
    // Remove seeded "You" entry if it exists to prevent duplication
    db.prepare('DELETE FROM leaderboard WHERE name = "You"').run();
    
    db.prepare('INSERT INTO leaderboard (name, score, is_mock) VALUES (?, ?, 0)').run(sanitizedName, score);

    res.status(200).json({ message: 'Score updated successfully', entry: { name: sanitizedName, score } });
  } catch (error) {
    console.error('Error updating leaderboard score:', error.message);
    res.status(500).json({ error: 'Failed to update score' });
  }
});

module.exports = router;
