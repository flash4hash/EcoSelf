const db = require('../db/db');

const getLeaderboard = (limit = 10) => {
  return db.prepare(
    'SELECT id, name, score, is_mock FROM leaderboard ' +
    'ORDER BY score DESC LIMIT ?'
  ).all(limit);
};

const upsertScore = (name, score) => {
  const existing = db.prepare(
    'SELECT id FROM leaderboard WHERE name = ? AND is_mock = 0'
  ).get(name);
  
  if (existing) {
    db.prepare(
      'UPDATE leaderboard SET score = ? WHERE id = ?'
    ).run(score, existing.id);
  } else {
    db.prepare(
      'INSERT INTO leaderboard (name, score, is_mock) VALUES (?, ?, 0)'
    ).run(name, score);
  }
  
  return { name, score };
};

module.exports = { getLeaderboard, upsertScore };
