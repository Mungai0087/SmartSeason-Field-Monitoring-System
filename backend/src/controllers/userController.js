const User = require('../models/User');
const Field = require('../models/Field');

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all agents
const getAgents = async (req, res) => {
  try {
    const agents = await User.getAgents();
    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const { calculateStatus } = require('../controllers/fieldController');

    let fields;
    if (req.user.role === 'admin') {
      fields = await Field.getAll();
    } else {
      fields = await Field.getByAgentId(req.user.id);
    }

    const fieldsWithStatus = fields.map(f => ({
      ...f,
      status: calculateStatus(f)
    }));

    const statusBreakdown = {
      active: fieldsWithStatus.filter(f => f.status === 'Active').length,
      atRisk: fieldsWithStatus.filter(f => f.status === 'At Risk').length,
      completed: fieldsWithStatus.filter(f => f.status === 'Completed').length
    };

    const stageBreakdown = {
      planted: fieldsWithStatus.filter(f => f.current_stage === 'Planted').length,
      growing: fieldsWithStatus.filter(f => f.current_stage === 'Growing').length,
      ready: fieldsWithStatus.filter(f => f.current_stage === 'Ready').length,
      harvested: fieldsWithStatus.filter(f => f.current_stage === 'Harvested').length
    };

    res.json({
      totalFields: fieldsWithStatus.length,
      statusBreakdown,
      stageBreakdown,
      fields: fieldsWithStatus
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getAgents,
  getDashboardStats
};
