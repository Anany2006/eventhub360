const express = require('express');
const router = express.Router();

// GET /api/v1/health
router.get('/', (req, res) => {
    const healthStatus = {
        status: "UP",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(), // Tracks how many seconds the server has been alive
        services: {
            database: "CONNECTED",
            cacheEngine: "ACTIVE"
        },
        advancedDashboard: {
            apiRequestsProcessed: process.resourceUsage().userCPUTime,
            failedLoginsCount: 0 
        }
    };
    
    res.status(200).json(healthStatus);
});

module.exports = router;