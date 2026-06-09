const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const protect = require('../middleware/auth'); // Import our JWT gatekeeper

// ==========================================
// 1. DEPARTMENT ROUTES
// ==========================================

// @route   GET /api/master/departments
// @desc    Get all available departments (Protected)
router.get('/departments', protect, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM departments ORDER BY department_name ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error fetching departments');
  }
});

// @route   POST /api/master/departments
// @desc    Create a new department (Protected)
router.post('/departments', protect, async (req, res) => {
  const { department_name } = req.body;

  if (!department_name) {
    return res.status(400).json({ message: 'Department name is required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO departments (department_name) VALUES ($1) RETURNING *',
      [department_name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error adding department');
  }
});

// ==========================================
// 2. SKILLS ROUTES
// ==========================================

// @route   GET /api/master/skills
// @desc    Get all available skills (Protected)
router.get('/skills', protect, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM skills ORDER BY skill_name ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error fetching skills');
  }
});

// @route   POST /api/master/skills
// @desc    Create a new skill (Protected)
router.post('/skills', protect, async (req, res) => {
  const { skill_name } = req.body;

  if (!skill_name) {
    return res.status(400).json({ message: 'Skill name is required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO skills (skill_name) VALUES ($1) RETURNING *',
      [skill_name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error adding skill');
  }
});

module.exports = router;