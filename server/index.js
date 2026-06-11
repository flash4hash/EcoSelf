const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pledgesRouter = require('./routes/pledges');
const leaderboardRouter = require('./routes/leaderboard');
const aiRouter = require('./routes/ai');

const helmet = require('helmet');
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config({ path: require('path').resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(requestLogger);
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [process.env.FRONTEND_URL || 'https://ecoself.onrender.com']
  : ['http://localhost:5173', 'http://localhost:3000'];
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

// Routes
app.use('/api/pledges', pledgesRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/ai', aiRouter);

// Global Error Handler
app.use(errorHandler);

// Serve React build in production
const path = require('path');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 EcoSelf backend server is running on port ${PORT}`);
});
