const path = require('path');
const fs = require('fs');

let db = null;
let isInMemory = false;

// Mock database in-memory storage (failsafe fallback)
const inMemoryStore = {
  pledges: [
    { id: 4, name: 'Vikram Singh', pledge: 'Refusing all single-use plastics and carrying a metal bottle everywhere. 🚫🥤', created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
    { id: 3, name: 'Ananya Iyer', pledge: 'I am going completely dairy-free starting this Tuesday. 🥛❌', created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString() },
    { id: 2, name: 'Priya Sharma', pledge: 'Switching all lights in my home to energy-efficient LEDs! 💡', created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
    { id: 1, name: 'Aarav Mehta', pledge: 'I pledge to cycle for all grocery runs under 2km! 🚲', created_at: new Date(Date.now() - 1000 * 60 * 40).toISOString() }
  ],
  leaderboard: [
    { id: 1, name: 'Aarav Mehta', score: 95, is_mock: 1 },
    { id: 2, name: 'Priya Sharma', score: 90, is_mock: 1 },
    { id: 3, name: 'Vikram Singh', score: 86, is_mock: 1 },
    { id: 4, name: 'Ananya Iyer', score: 82, is_mock: 1 },
    { id: 5, name: 'Rohan Gupta', score: 78, is_mock: 1 },
    { id: 6, name: 'Diya Patel', score: 75, is_mock: 1 },
    { id: 7, name: 'Amit Verma', score: 70, is_mock: 1 },
    { id: 8, name: 'Sneha Reddy', score: 65, is_mock: 1 },
    { id: 9, name: 'Kabir Joshi', score: 60, is_mock: 1 }
  ]
};

try {
  const Database = require('better-sqlite3');
  const dbPath = path.join(__dirname, 'ecoself.db');
  db = new Database(dbPath);

  // Initialize schema
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schema);
  console.log('Successfully connected to SQLite database: ecoself.db');
} catch (error) {
  console.warn('⚠️ WARNING: Failed to load better-sqlite3 or initialize sqlite database. Falling back to In-Memory JS store.', error.message);
  isInMemory = true;
  
  db = {
    prepare: (sql) => {
      const normalizedSql = sql.toLowerCase().trim();
      return {
        all: (...args) => {
          if (normalizedSql.includes('from pledges')) {
            // Return top 10 recent pledges
            return [...inMemoryStore.pledges]
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .slice(0, 10);
          }
          if (normalizedSql.includes('from leaderboard')) {
            // Return sorted top scores
            return [...inMemoryStore.leaderboard]
              .sort((a, b) => b.score - a.score)
              .slice(0, 10);
          }
          return [];
        },
        run: (...args) => {
          if (normalizedSql.includes('insert into pledges')) {
            // args: [name, pledge]
            const name = args[0];
            const pledge = args[1];
            const newPledge = {
              id: inMemoryStore.pledges.length + 1,
              name,
              pledge,
              created_at: new Date().toISOString()
            };
            inMemoryStore.pledges.push(newPledge);
            return { changes: 1, lastInsertRowid: newPledge.id };
          }
          if (normalizedSql.includes('insert into leaderboard') || 
              normalizedSql.includes('replace into leaderboard') ||
              normalizedSql.includes('update leaderboard')) {
            // args: [name, score] or [score, name] depending on query.
            // Let's assume standard INSERT OR REPLACE or dynamic check
            let name, score;
            if (normalizedSql.includes('replace into leaderboard') || normalizedSql.includes('insert into leaderboard')) {
              name = args[0];
              score = args[1];
            } else if (normalizedSql.includes('update leaderboard')) {
              // UPDATE leaderboard SET score = ? WHERE name = ?
              score = args[0];
              name = args[1];
            }
            
            const existingIndex = inMemoryStore.leaderboard.findIndex(entry => entry.name.toLowerCase() === name.toLowerCase());
            if (existingIndex !== -1) {
              inMemoryStore.leaderboard[existingIndex].score = score;
              inMemoryStore.leaderboard[existingIndex].is_mock = 0;
            } else {
              inMemoryStore.leaderboard.push({
                id: inMemoryStore.leaderboard.length + 1,
                name,
                score,
                is_mock: 0
              });
            }
            return { changes: 1 };
          }
          if (normalizedSql.includes('delete from leaderboard')) {
            let nameToDelete;
            if (normalizedSql.includes('where name = "you"')) {
              nameToDelete = 'You';
            } else if (args.length > 0) {
              nameToDelete = args[0];
            }

            if (nameToDelete) {
              const initialLength = inMemoryStore.leaderboard.length;
              inMemoryStore.leaderboard = inMemoryStore.leaderboard.filter(
                entry => entry.name.toLowerCase() !== nameToDelete.toLowerCase()
              );
              return { changes: initialLength - inMemoryStore.leaderboard.length };
            }
            return { changes: 0 };
          }
          return { changes: 0 };
        }
      };
    }
  };
}

module.exports = db;
