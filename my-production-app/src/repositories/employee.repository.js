// Mock database array representing your dataset table
const MOCK_DATABASE = [
    { id: 1, name: "Alice Smith", email: "alice@company.com", salary: 85000, department: "Engineering" },
    { id: 2, name: "Bob Jones", email: "bob@company.com", salary: 92000, department: "Engineering" },
    { id: 3, name: "Charlie Day", email: "charlie@company.com", salary: 60000, department: "HR" },
    { id: 4, name: "Diana Prince", email: "diana@company.com", salary: 120000, department: "Management" }
];

const findAllOptimized = async ({ limit, offset, search, sortBy, orderBy, department }) => {
    let records = [...MOCK_DATABASE];

    // 1. Module 9: Search Query Interception (Case-Insensitive Simulation)
    if (search) {
        records = records.filter(emp => emp.name.toLowerCase().includes(search.toLowerCase()));
    }

    // 2. Module 10: Structural Category Filtering
    if (department) {
        records = records.filter(emp => emp.department.toLowerCase() === department.toLowerCase());
    }

    // 3. Module 10: Dynamic Column Sorting (e.g., Sorting by numeric Salaries)
    records.sort((a, b) => {
        let valueA = a[sortBy];
        let valueB = b[sortBy];
        
        if (valueA < valueB) return orderBy === 'asc' ? -1 : 1;
        if (valueA > valueB) return orderBy === 'asc' ? 1 : -1;
        return 0;
    });

    // 4. Module 8: Pagination Offset Boundary Windowing
    const totalRecords = records.length;
    const paginatedResults = records.slice(offset, offset + limit);

    return {
        metadata: {
            totalItems: totalRecords,
            itemsPerPage: limit,
            currentPage: Math.floor(offset / limit) + 1,
            totalPages: Math.ceil(totalRecords / limit)
        },
        results: paginatedResults
    };
};

const getDashboardMetricsView = async () => {
    // Simulating standard delivery payload from 'employee_dashboard_view'
    return [
        { department: "Engineering", total_staff: 2, average_compensation: 88500.00 },
        { department: "HR", total_staff: 1, average_compensation: 60000.00 },
        { department: "Management", total_staff: 1, average_compensation: 120000.00 }
    ];
};

module.exports = { 
    findAllOptimized, 
    getDashboardMetricsView 
};