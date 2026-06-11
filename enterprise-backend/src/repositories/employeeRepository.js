const pool = require('../config/db');

class EmployeeRepository {
  // Method to link a user to a department and designation
  async createProfile(profileData) {
    const { user_id, department_id, designation } = profileData;
    const query = `
      INSERT INTO employee_profiles (user_id, department_id, designation)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [user_id, department_id, designation];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  // Method that calls the Stored Procedure Function we made in Neon!
  async getLeaveBalance(employeeId) {
    const query = `SELECT calculate_leave_balance($1) AS remaining_leaves;`;
    const { rows } = await pool.query(query, [employeeId]);
    return rows[0].remaining_leaves;
  }
}

module.exports = new EmployeeRepository();