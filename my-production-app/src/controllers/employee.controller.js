const employeeService = require('../services/employee.service');

const getAllEmployees = async (req, res, next) => {
    try {
        // req.query parses everything after the "?" symbol in the URL string
        const optimizedData = await employeeService.fetchAllEmployees(req.query);
        res.status(200).json({ success: true, data: optimizedData });
    } catch (error) {
        next(error);
    }
};

const getEmployeeDashboard = async (req, res, next) => {
    try {
        const metrics = await employeeService.getDashboardMetricsView();
        res.status(200).json({ success: true, data: metrics });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllEmployees, getEmployeeDashboard };