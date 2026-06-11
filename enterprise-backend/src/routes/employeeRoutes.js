const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// Route to create a profile connection
router.post('/profile', employeeController.createProfile);

// Route to calculate live leaves using our Neon Stored Procedure
router.get('/:id/leaves', employeeController.getLeaves);

// Fetch business intelligence from your SQL database view
router.get('/reports/summary', employeeController.getSummaryReport);

module.exports = router;