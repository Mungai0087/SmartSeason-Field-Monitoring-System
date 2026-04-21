const express = require('express');
const userController = require('../controllers/userController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

// Admin routes
router.get('/', authorizeRole(['admin']), userController.getAllUsers);
router.get('/agents', userController.getAgents);

// Dashboard - both roles
router.get('/dashboard/stats', userController.getDashboardStats);

module.exports = router;
