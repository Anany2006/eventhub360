const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const protect = require('../middleware/auth');

// =========================================================
// 1. DASHBOARD STATISTICS ROUTE (GET /api/analytics/stats)
// =========================================================
router.get('/stats', protect, async (req, res) => {
  try {
    // Run all count queries simultaneously using Promise.all for high performance
    const [empCount, deptCount, skillCount, imgCount] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM employee_profiles'),
      pool.query('SELECT COUNT(*) FROM departments'),
      pool.query('SELECT COUNT(*) FROM skills'),
      pool.query('SELECT COUNT(*) FROM employee_images')
    ]);

    res.json({
      totalEmployees: parseInt(empCount.rows[0].count),
      totalDepartments: parseInt(deptCount.rows[0].count),
      totalSkills: parseInt(skillCount.rows[0].count),
      totalImages: parseInt(imgCount.rows[0].count)
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error generating metrics dashboard stats');
  }
});

// =========================================================
// 2. JOIN QUERY 1: Employees & Departments (GET /api/analytics/join1)
// =========================================================
router.get('/join1', protect, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.name, d.department_name
      FROM employee_profiles ep
      INNER JOIN users u ON ep.user_id = u.id
      INNER JOIN departments d ON ep.department_id = d.id;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error running SQL Join 1');
  }
});

// =========================================================
// 3. JOIN QUERY 2: Employees & Associated Skills (GET /api/analytics/join2)
// =========================================================
router.get('/join2', protect, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.name, s.skill_name
      FROM employee_skills es
      INNER JOIN employee_profiles ep ON es.employee_id = ep.id
      INNER JOIN users u ON ep.user_id = u.id
      INNER JOIN skills s ON es.skill_id = s.id;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error running SQL Join 2');
  }
});

module.exports = router;