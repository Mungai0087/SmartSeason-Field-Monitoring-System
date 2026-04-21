const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { hashPassword } = require('./auth');

const dbPath = process.env.DB_PATH || path.join(__dirname, '../../smartseason.db');
const db = new sqlite3.Database(dbPath);

// Initialize database schema
const initDB = () => {
  return new Promise((resolve, reject) => {
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('admin', 'agent')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS fields (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        crop_type TEXT NOT NULL,
        planting_date DATE NOT NULL,
        current_stage TEXT NOT NULL CHECK(current_stage IN ('Planted', 'Growing', 'Ready', 'Harvested')),
        agent_id INTEGER NOT NULL,
        created_by INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(agent_id) REFERENCES users(id),
        FOREIGN KEY(created_by) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS field_updates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        field_id INTEGER NOT NULL,
        updated_stage TEXT NOT NULL CHECK(updated_stage IN ('Planted', 'Growing', 'Ready', 'Harvested')),
        notes TEXT,
        updated_by INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(field_id) REFERENCES fields(id),
        FOREIGN KEY(updated_by) REFERENCES users(id)
      );
    `, async (err) => {
      if (err) {
        reject(err);
      } else {
        // Seed default admin user
        try {
          const hashedPassword = await hashPassword('admin123');
          db.run(
            'INSERT OR IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            ['Admin', 'admin@smartseason.com', hashedPassword, 'admin'],
            (err) => {
              if (err) reject(err);
              else resolve();
            }
          );
        } catch (err) {
          reject(err);
        }
      }
    });
  });
};

// Database operations wrapped in promises
const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

module.exports = {
  db,
  initDB,
  dbRun,
  dbGet,
  dbAll
};
