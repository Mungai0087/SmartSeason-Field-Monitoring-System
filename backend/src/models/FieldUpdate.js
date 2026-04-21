const { dbRun, dbGet, dbAll } = require('../utils/database');

class FieldUpdate {
  static async create(fieldId, newStage, notes, updatedBy) {
    const result = await dbRun(
      `INSERT INTO field_updates (field_id, updated_stage, notes, updated_by) 
       VALUES (?, ?, ?, ?)`,
      [fieldId, newStage, notes, updatedBy]
    );
    return { id: result.id, fieldId, newStage, notes, updatedBy };
  }

  static async getByFieldId(fieldId) {
    return dbAll(`
      SELECT fu.*, u.name as updated_by_name 
      FROM field_updates fu 
      LEFT JOIN users u ON fu.updated_by = u.id 
      WHERE fu.field_id = ? 
      ORDER BY fu.created_at DESC
    `, [fieldId]);
  }

  static async getAll() {
    return dbAll(`
      SELECT fu.*, u.name as updated_by_name, f.name as field_name 
      FROM field_updates fu 
      LEFT JOIN users u ON fu.updated_by = u.id 
      LEFT JOIN fields f ON fu.field_id = f.id 
      ORDER BY fu.created_at DESC
    `);
  }
}

module.exports = FieldUpdate;
