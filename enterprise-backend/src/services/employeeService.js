const employeeRepository = require('../repositories/employeeRepository');

class EmployeeService {
  async onboardEmployee(profileData) {
    // Business Logic: Ensure IDs are valid numbers before going to DB
    if (isNaN(profileData.user_id) || isNaN(profileData.department_id)) {
      throw new Error('Invalid User or Department selection.');
    }
    return await employeeRepository.createProfile(profileData);
  }

  async checkLeaveBalance(employeeId) {
    return await employeeRepository.getLeaveBalance(employeeId);
  }
}

module.exports = new EmployeeService();