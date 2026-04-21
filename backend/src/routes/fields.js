const express = require('express');
const fieldController = require('../controllers/fieldController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// All field routes require authentication
router.use(authenticateToken);

// Admin routes
router.post('/', authorizeRole(['admin']), fieldController.createField);
router.get('/', fieldController.getAllFields);
router.put('/:id/reassign', authorizeRole(['admin']), fieldController.reassignField);
router.delete('/:id', authorizeRole(['admin']), fieldController.deleteField);

// Agent and admin routes
router.get('/my-fields', fieldController.getMyFields);
router.get('/:id', fieldController.getField);
router.put('/:id/stage', fieldController.updateFieldStage);
router.get('/:id/updates', fieldController.getFieldUpdates);

module.exports = router;
