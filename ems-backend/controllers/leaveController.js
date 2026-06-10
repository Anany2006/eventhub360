// controllers/leaveController.js
const leaveService = require('../services/leaveService');

class LeaveController {
    async getDashboard(req, res) {
        try {
            const data = await leaveService.fetchDashboardAnalytics();
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async updateWorkflow(req, res) {
        try {
            const { leaveId, approvedBy, actionStatus, remarks } = req.body;
            
            // Basic parameter validation check
            if (!leaveId || !approvedBy || !actionStatus) {
                return res.status(400).json({ error: 'Missing mandatory request criteria attributes.' });
            }

            const outcome = await leaveService.processWorkflowAction(leaveId, approvedBy, actionStatus, remarks);
            return res.status(200).json(outcome);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new LeaveController();