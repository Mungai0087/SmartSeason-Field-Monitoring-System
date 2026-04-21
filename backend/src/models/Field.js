const { dbRun, dbGet, dbAll } = require('../utils/database');

class Field {
  static async create(name, cropType, plantingDate, agentId, createdBy) {
    const result = await dbRun(
      `INSERT INTO fields (name, crop_type, planting_date, current_stage, agent_id, created_by) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, cropType, plantingDate, 'Planted', agentId, createdBy]
    );
    return { id: result.id, name, cropType, plantingDate, currentStage: 'Planted', agentId, createdBy };
  }

  static async findById(id) {
    return dbGet('SELECT * FROM fields WHERE id = ?', [id]);
  }

  static async getAll() {
    return dbAll(`
      SELECT f.*, u.name as agent_name 
      FROM fields f 
      LEFT JOIN users u ON f.agent_id = u.id 
      ORDER BY f.created_at DESC
    `);
  }

  static async getByAgentId(agentId) {
    return dbAll(`
      SELECT f.*, u.name as agent_name 
      FROM fields f 
      LEFT JOIN users u ON f.agent_id = u.id 
      WHERE f.agent_id = ? 
      ORDER BY f.created_at DESC
    `, [agentId]);
  }

  static async updateStage(fieldId, newStage) {
    await dbRun(
      'UPDATE fields SET current_stage = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newStage, fieldId]
    );
    return this.findById(fieldId);
  }

  static async updateAssignedAgent(fieldId, agentId) {
    await dbRun(
      'UPDATE fields SET agent_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [agentId, fieldId]
    );
    return this.findById(fieldId);
  }

  static async delete(fieldId) {
    await dbRun('DELETE FROM fields WHERE id = ?', [fieldId]);
  }
}

module.exports = Field;
