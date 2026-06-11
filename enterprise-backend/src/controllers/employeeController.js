const employeeService = require('../services/employeeService');

class EmployeeController {
  async createProfile(req, res, next) {
    try {
      const profile = await employeeService.onboardEmployee(req.body);
      return res.status(201).json({
        success: true,
        message: 'Employee profile linked successfully!',
        data: profile
      });
    } catch (error) {
      next(error);
    }
  }

  async getLeaves(req, res, next) {
    try {
      const { id } = req.params;
      const balance = await employeeService.checkLeaveBalance(id);
      return res.status(200).json({
        success: true,
        employee_id: id,
        remaining_leaves: balance
      });
    } catch (error) {
      next(error);
    }
  }

  async getSummaryReport(req, res, next) {
    try {
      const report = await employeeService.getSummaryReport();
      return res.status(200).json({
        success: true,
        count: report.length,
        data: report
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EmployeeController();