-- Module 14: Query Optimization Indexing
-- Speeds up search queries filtering users by email address
CREATE INDEX idx_users_email ON users(email);

-- Module 15: Structural Summary Views
-- Combines metrics into an aggregated data view to avoid heavy real-time table JOIN calculations
CREATE VIEW employee_dashboard_view AS 
SELECT 
    department, 
    COUNT(id) as total_staff, 
    ROUND(AVG(salary), 2) as average_compensation
FROM employees 
GROUP BY department;