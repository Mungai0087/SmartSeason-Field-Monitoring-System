const Field = require('../models/Field');
const FieldUpdate = require('../models/FieldUpdate');

// Calculate field status based on stage and time
const calculateStatus = (field) => {
  const stages = ['Planted', 'Growing', 'Ready', 'Harvested'];
  const currentIndex = stages.indexOf(field.current_stage);
  
  const plantingDate = new Date(field.planting_date);
  const now = new Date();
  const daysElapsed = Math.floor((now - plantingDate) / (1000 * 60 * 60 * 24));

  // Expected days for each stage
  const expectedDays = {
    'Planted': 7,
    'Growing': 60,
    'Ready': 14,
    'Harvested': 0
  };

  if (field.current_stage === 'Harvested') {
    return 'Completed';
  }

  // If way behind schedule (more than 20% over expected time for current stage), mark as at-risk
  const expectedTime = expectedDays[field.current_stage] || 30;
  if (daysElapsed > expectedTime * 1.2) {
    return 'At Risk';
  }

  return 'Active';
};

// Create a new field
const createField = async (req, res) => {
  try {
    const { name, cropType, plantingDate, agentId } = req.body;

    if (!name || !cropType || !plantingDate || !agentId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const field = await Field.create(name, cropType, plantingDate, agentId, req.user.id);
    res.status(201).json({ message: 'Field created successfully', field });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all fields (admin only)
const getAllFields = async (req, res) => {
  try {
    const fields = await Field.getAll();
    const fieldsWithStatus = fields.map(f => ({
      ...f,
      status: calculateStatus(f)
    }));
    res.json(fieldsWithStatus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get assigned fields for agent
const getMyFields = async (req, res) => {
  try {
    const fields = await Field.getByAgentId(req.user.id);
    const fieldsWithStatus = fields.map(f => ({
      ...f,
      status: calculateStatus(f)
    }));
    res.json(fieldsWithStatus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single field
const getField = async (req, res) => {
  try {
    const field = await Field.findById(req.params.id);
    if (!field) {
      return res.status(404).json({ error: 'Field not found' });
    }

    // Check authorization for agents
    if (req.user.role === 'agent' && field.agent_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updates = await FieldUpdate.getByFieldId(req.params.id);
    res.json({
      ...field,
      status: calculateStatus(field),
      updates
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update field stage and add notes
const updateFieldStage = async (req, res) => {
  try {
    const { newStage, notes } = req.body;
    const fieldId = req.params.id;

    if (!newStage) {
      return res.status(400).json({ error: 'New stage is required' });
    }

    const validStages = ['Planted', 'Growing', 'Ready', 'Harvested'];
    if (!validStages.includes(newStage)) {
      return res.status(400).json({ error: 'Invalid stage' });
    }

    const field = await Field.findById(fieldId);
    if (!field) {
      return res.status(404).json({ error: 'Field not found' });
    }

    // Check authorization for agents
    if (req.user.role === 'agent' && field.agent_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Update field stage
    const updatedField = await Field.updateStage(fieldId, newStage);

    // Record the update
    await FieldUpdate.create(fieldId, newStage, notes, req.user.id);

    res.json({
      message: 'Field updated successfully',
      field: { ...updatedField, status: calculateStatus(updatedField) }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reassign field to different agent (admin only)
const reassignField = async (req, res) => {
  try {
    const { agentId } = req.body;
    const fieldId = req.params.id;

    if (!agentId) {
      return res.status(400).json({ error: 'Agent ID is required' });
    }

    const field = await Field.findById(fieldId);
    if (!field) {
      return res.status(404).json({ error: 'Field not found' });
    }

    const updatedField = await Field.updateAssignedAgent(fieldId, agentId);
    res.json({ message: 'Field reassigned successfully', field: updatedField });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete field (admin only)
const deleteField = async (req, res) => {
  try {
    const field = await Field.findById(req.params.id);
    if (!field) {
      return res.status(404).json({ error: 'Field not found' });
    }

    await Field.delete(req.params.id);
    res.json({ message: 'Field deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get field updates history
const getFieldUpdates = async (req, res) => {
  try {
    const updates = await FieldUpdate.getByFieldId(req.params.id);
    res.json(updates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createField,
  getAllFields,
  getMyFields,
  getField,
  updateFieldStage,
  reassignField,
  deleteField,
  getFieldUpdates,
  calculateStatus
};
