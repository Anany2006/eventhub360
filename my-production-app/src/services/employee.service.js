const employeeRepository = require('../repositories/employee.repository');

const fetchAllEmployees = async (queryParams) => {
    // ... your existing code for pagination/search/sorting is fine here!
    const { page = 1, limit = 2, search = '', sortBy = 'id', orderBy = 'asc', department } = queryParams;
    const parsedPage = Math.max(1, parseInt(page, 10));
    const parsedLimit = Math.max(1, parseInt(limit, 10));
    const offset = (parsedPage - 1) * parsedLimit;

    return await employeeRepository.findAllOptimized({
        limit: parsedLimit,
        offset,
        search: search.trim(),
        sortBy,
        orderBy: orderBy.toLowerCase() === 'desc' ? 'desc' : 'asc',
        department
    });
};

// 🌟 ADD THIS NEW SERVICE MIDDLE-MAN FUNCTION (Module 15)
const getDashboardMetricsView = async () => {
    return await employeeRepository.getDashboardMetricsView();
};

// 🌟 MAKE SURE IT IS EXPORTED HERE
module.exports = { 
    fetchAllEmployees,
    getDashboardMetricsView 
};