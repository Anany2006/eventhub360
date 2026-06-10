// repositories/leaveRepository.js
const pool = require('../config/db');

class LeaveRepository {
    // Queries the view built in Step 3 of Phase 1
    async getDashboardMetrics() {
        const query = 'SELECT * FROM view_dashboard_analytics;';
        const { rows } = await pool.query(query);
        return rows[0];
    }

    // Fetches a snapshot of an application with a row-level lock for transactional stability
    async findApplicationForUpdate(client, leaveId) {
        const query = 'SELECT employee_id, leave_type_id, total_days FROM leave_applications WHERE id = $1 FOR UPDATE;';
        const { rows } = await client.query(query, [leaveId]);
        return rows[0];
    }

    async updateApplicationStatus(client, leaveId, status) {
        const query = 'UPDATE leave_applications SET status = $1 WHERE id = $2;';
        await client.query(query, [status, leaveId]);
    }

    async insertApprovalHistory(client, leaveId, approvedBy, action, remarks) {
        const query = 'INSERT INTO approval_history (leave_id, approved_by, action, remarks) VALUES ($1, $2, $3, $4);';
        await client.query(query, [leaveId, approvedBy, action, remarks]);
    }

    async deductEmployeeLeaveBalance(client, userId, leaveTypeId, totalDays) {
        // Fetch target internal employee profile identifier mapping to structural user accounts
        const profileQuery = 'SELECT id FROM employee_profiles WHERE user_id = $1;';
        const profileResult = await client.query(profileQuery, [userId]);
        const employeeId = profileResult.rows[0]?.id;

        const query = `
            UPDATE leave_balance 
            SET available_days = available_days - $1 
            WHERE employee_id = $2 AND leave_type_id = $3 AND available_days >= $1;
        `;
        const result = await client.query(query, [totalDays, employeeId, leaveTypeId]);
        return result.rowCount > 0; // Returns true if subtraction criteria was met safely
    }
}

module.exports = new LeaveRepository();