const { dbRun, dbGet, dbAll } = require('../utils/database');
const { hashPassword } = require('../utils/auth');

class User {
  static async create(name, email, password, role) {
    const hashedPassword = await hashPassword(password);
    const result = await dbRun(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );
    return { id: result.id, name, email, role };
  }

  static async findByEmail(email) {
    return dbGet('SELECT * FROM users WHERE email = ?', [email]);
  }

  static async findById(id) {
    return dbGet('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [id]);
  }

  static async getAll() {
    return dbAll('SELECT id, name, email, role, created_at FROM users');
  }

  static async getAgents() {
    return dbAll("SELECT id, name, email FROM users WHERE role = 'agent'");
  }
}

module.exports = User;
