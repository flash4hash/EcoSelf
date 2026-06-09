const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pledgesRouter = require('./routes/pledges');
const leaderboardRouter = require('./routes/leaderboard');
const aiRouter = require('./routes/ai');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/pledges', pledgesRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/ai', aiRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal server error occurred' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 EcoSelf backend server is running on port ${PORT}`);
});
