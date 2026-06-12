const express = require('express');
const employeeRoutes = require('./v1/employee.route');
const healthRoutes = require('./v1/health.route');

const router = express.Router();

router.use('/v1/employees', employeeRoutes);
router.use('/v1/health', healthRoutes);

module.exports = router;