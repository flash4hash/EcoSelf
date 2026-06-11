const db = require('../db/db');
const { sanitizeText } = require('../validators/pledgeValidator');

const getPledges = (limit = 10) => {
  return db.prepare(
    'SELECT id, name, pledge, created_at FROM pledges ' +
    'ORDER BY id DESC LIMIT ?'
  ).all(limit);
};

const createPledge = (rawName, rawPledge) => {
  const name = sanitizeText(rawName).slice(0, 50);
  const pledge = sanitizeText(rawPledge);
  db.prepare(
    'INSERT INTO pledges (name, pledge) VALUES (?, ?)'
  ).run(name, pledge);
  return { name, pledge };
};

module.exports = { getPledges, createPledge };
