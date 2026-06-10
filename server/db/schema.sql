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
INSERT INTO leaderboard (name, score, is_mock) VALUES ('EcoSelf Demo', 95, 1);
INSERT INTO leaderboard (name, score, is_mock) VALUES ('Priya Sharma', 90, 1);
INSERT INTO leaderboard (name, score, is_mock) VALUES ('Vikram Singh', 86, 1);
INSERT INTO leaderboard (name, score, is_mock) VALUES ('Ananya Iyer', 82, 1);
INSERT INTO leaderboard (name, score, is_mock) VALUES ('Rohan Gupta', 78, 1);
INSERT INTO leaderboard (name, score, is_mock) VALUES ('Diya Patel', 75, 1);
INSERT INTO leaderboard (name, score, is_mock) VALUES ('Amit Verma', 70, 1);
INSERT INTO leaderboard (name, score, is_mock) VALUES ('Sneha Reddy', 65, 1);
INSERT INTO leaderboard (name, score, is_mock) VALUES ('Kabir Joshi', 60, 1);

-- Seed mock pledges
INSERT INTO pledges (name, pledge) VALUES ('Priya S', 'I pledge to take the metro every day instead of driving my car this month!');
INSERT INTO pledges (name, pledge) VALUES ('Vikram M', 'Switching to a vegetarian diet for 3 days each week starting today. 🌱');
INSERT INTO pledges (name, pledge) VALUES ('Anjali R', 'No single-use plastic bags for the entire month. Cloth bag everywhere!');
INSERT INTO pledges (name, pledge) VALUES ('Rohan K', 'Turning off all standby appliances at the wall every night before bed.');
