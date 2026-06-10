// routes/leaveRoutes.js
const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const { validateWorkflowPayload } = require('../middleware/validateEngine');

router.get('/dashboard', leaveController.getDashboard);

// Inject validation middleware right before processing the controller
router.post('/approve-workflow', validateWorkflowPayload, leaveController.updateWorkflow);

module.exports = router;