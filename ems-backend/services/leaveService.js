// services/leaveService.js
const pool = require('../config/db');
const leaveRepository = require('../repositories/leaveRepository');

class LeaveService {
    async fetchDashboardAnalytics() {
        return await leaveRepository.getDashboardMetrics();
    }

    async processWorkflowAction(leaveId, approvedBy, actionStatus, remarks) {
        const client = await pool.connect();
        try {
            // BEGIN ACID Transaction Block
            await client.query('BEGIN');

            // 1. Fetch targeted leave details securely
            const application = await leaveRepository.findApplicationForUpdate(client, leaveId);
            if (!application) {
                throw new Error('Application record not found.');
            }

            // 2. Modify State Status
            await leaveRepository.updateApplicationStatus(client, leaveId, actionStatus);

            // 3. Document Action within Audit Trail Logs
            await leaveRepository.insertApprovalHistory(client, leaveId, approvedBy, actionStatus, remarks);

            // 4. Conditional Balance Adjustment Verification Management
            if (actionStatus === 'Approved') {
                const balanceDeducted = await leaveRepository.deductEmployeeLeaveBalance(
                    client, 
                    application.employee_id, 
                    application.leave_type_id, 
                    application.total_days
                );

                if (!balanceDeducted) {
                    throw new Error('Transaction Rejected: Insufficient available remaining leave balance.');
                }
            }

            // COMMIT changes all together securely if no errors occur
            await client.query('COMMIT');
            return { message: `Workflow transitioned successfully to status: ${actionStatus}.` };

        } catch (error) {
            // ROLLBACK cancels changes entirely if any sub-action encounters unexpected issues
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}

module.exports = new LeaveService();