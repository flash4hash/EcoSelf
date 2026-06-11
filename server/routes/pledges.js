const express = require('express');
const router = express.Router();
const { validatePledgeInput } = require('../validators/pledgeValidator');
const { getPledges, createPledge } = require('../services/pledgeService');

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
    const pledges = getPledges(10);
    res.json(pledges);
  } catch (error) {
    console.error('Error fetching pledges:', error.message);
    res.status(500).json({ error: 'Failed to retrieve pledges' });
  }
});

// POST /api/pledges - Submit a new pledge with input sanitization and length limit
router.post('/', pledgeLimiter, (req, res) => {
  try {
    const validation = validatePledgeInput(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.errors[0] });
    }

    const result = createPledge(req.body.name, req.body.pledge);
    res.status(201).json({ 
      message: 'Pledge submitted successfully', 
      pledge: result 
    });
  } catch (error) {
    console.error('Error saving pledge:', error.message);
    res.status(500).json({ error: 'Failed to save pledge' });
  }
});

module.exports = router;
