-- Create pledges table
CREATE TABLE IF NOT EXISTS pledges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  pledge TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create leaderboard table
CREATE TABLE IF NOT EXISTS leaderboard (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  score INTEGER NOT NULL,
  is_mock INTEGER DEFAULT 1
);

-- Seed mock leaderboard entries (9 entries, leaving room for user)
INSERT INTO leaderboard (name, score, is_mock) VALUES ('Aarav Mehta', 95, 1);
INSERT INTO leaderboard (name, score, is_mock) VALUES ('Priya Sharma', 90, 1);
INSERT INTO leaderboard (name, score, is_mock) VALUES ('Vikram Singh', 86, 1);
INSERT INTO leaderboard (name, score, is_mock) VALUES ('Ananya Iyer', 82, 1);
INSERT INTO leaderboard (name, score, is_mock) VALUES ('Rohan Gupta', 78, 1);
INSERT INTO leaderboard (name, score, is_mock) VALUES ('Diya Patel', 75, 1);
INSERT INTO leaderboard (name, score, is_mock) VALUES ('Amit Verma', 70, 1);
INSERT INTO leaderboard (name, score, is_mock) VALUES ('Sneha Reddy', 65, 1);
INSERT INTO leaderboard (name, score, is_mock) VALUES ('Kabir Joshi', 60, 1);

-- Seed mock pledges
INSERT INTO pledges (name, pledge) VALUES ('Aarav Mehta', 'I pledge to cycle for all grocery runs under 2km! 🚲');
INSERT INTO pledges (name, pledge) VALUES ('Priya Sharma', 'Switching all lights in my home to energy-efficient LEDs! 💡');
INSERT INTO pledges (name, pledge) VALUES ('Ananya Iyer', 'I am going completely dairy-free starting this Tuesday. 🥛❌');
INSERT INTO pledges (name, pledge) VALUES ('Vikram Singh', 'Refusing all single-use plastics and carrying a metal bottle everywhere. 🚫🥤');
