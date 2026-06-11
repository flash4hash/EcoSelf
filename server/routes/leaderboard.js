const express = require('express');
const router = express.Router();
const { validateScoreInput } = require('../validators/scoreValidator');
const { getLeaderboard, upsertScore } = require('../services/leaderboardService');

// GET /api/leaderboard - Get top 10 leaderboard entries
router.get('/', (req, res) => {
  try {
    const scores = getLeaderboard(10);
    res.json(scores);
  } catch (error) {
    console.error('Error fetching leaderboard:', error.message);
    res.status(500).json({ error: 'Failed to retrieve leaderboard' });
  }
});

// POST /api/leaderboard - Submit or update user score
router.post('/', (req, res) => {
  try {
    const validation = validateScoreInput(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.errors[0] });
    }

    const { name, score } = req.body;
    const sanitizedName = name.replace(/<[^>]*>/g, '').trim();

    const result = upsertScore(sanitizedName, score);

    res.status(200).json({ message: 'Score updated successfully', entry: result });
  } catch (error) {
    console.error('Error updating leaderboard score:', error.message);
    res.status(500).json({ error: 'Failed to update score' });
  }
});

module.exports = router;
