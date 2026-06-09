const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const pool = require('../config/db');
const protect = require('../middleware/auth');

// ==========================================
// MULTER SETUP FOR MULTIPLE FILE UPLOADS
// ==========================================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Saves files inside the local uploads folder
  },
  filename: function (req, file, cb) {
    // Generates a unique filename using timestamps
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

// Allowed file types filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only images (JPEG/JPG/PNG) and PDFs are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit per file
});


// ==========================================
// 1. CREATE EMPLOYEE PROFILE WITH IMAGES & SKILLS
// ==========================================
// @route   POST /api/employees
// Expects multipart/form-data (fields + files key named 'documents')
router.post('/', protect, upload.array('documents', 5), async (req, res) => {
  const client = await pool.connect(); // Use a single client connection for safe transaction handling
  
  try {
    const { user_id, department_id, phone, address, designation, salary, skills } = req.body;
    
    // Begin Database Transaction
    await client.query('BEGIN');

    // 1. Insert Core Employee Profile Data
    const employeeResult = await client.query(
      `INSERT INTO employee_profiles (user_id, department_id, phone, address, designation, salary) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [user_id, department_id, phone, address, designation, salary]
    );
    const employeeId = employeeResult.rows[0].id;

    // 2. Save Uploaded Files Info to DB (if files were sent)
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const imageUrl = `/uploads/${file.filename}`;
        await client.query(
          `INSERT INTO employee_images (employee_id, image_url) VALUES ($1, $2)`,
          [employeeId, imageUrl]
        );
      }
    }

    // 3. Link Skills to Employee in Bridge Table (if skills array was passed)
    if (skills) {
      // If skills come as a comma-separated string from multipart frontend form, parse it
      const skillIds = Array.isArray(skills) ? skills : JSON.parse(skills);
      for (let skillId of skillIds) {
        await client.query(
          `INSERT INTO employee_skills (employee_id, skill_id) VALUES ($1, $2)`,
          [employeeId, skillId]
        );
      }
    }

    // Commit Transaction to DB
    await client.query('COMMIT');
    
    res.status(201).json({
      message: 'Employee Profile created successfully!',
      employee: employeeResult.rows[0]
    });

  } catch (err) {
    await client.query('ROLLBACK'); // Cancel changes if anything fails
    console.error(err.message);
    res.status(500).send('Server error creating employee profile');
  } finally {
    client.release();
  }
});


// ==========================================
// 2. GET ALL EMPLOYEES LIST
// ==========================================
// @route   GET /api/employees
router.get('/', protect, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT ep.*, u.name as employee_name, u.email, d.department_name 
      FROM employee_profiles ep
      INNER JOIN users u ON ep.user_id = u.id
      LEFT JOIN departments d ON ep.department_id = d.id
      ORDER BY ep.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error fetching employee list');
  }
});


// ==========================================
// 3. GET SINGLE EMPLOYEE PROFILE DETAILS BY ID
// ==========================================
// @route   GET /api/employees/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Fetch core details
    const profileRes = await pool.query(`
      SELECT ep.*, u.name as employee_name, u.email, d.department_name 
      FROM employee_profiles ep
      INNER JOIN users u ON ep.user_id = u.id
      LEFT JOIN departments d ON ep.department_id = d.id
      WHERE ep.id = $1
    `, [id]);

    if (profileRes.rows.length === 0) {
      return res.status(404).json({ message: 'Employee profile not found' });
    }

    // Fetch employee's dynamic documents/images
    const imagesRes = await pool.query('SELECT * FROM employee_images WHERE employee_id = $1', [id]);
    
    // Fetch employee's skill identifiers
    const skillsRes = await pool.query(`
      SELECT s.* FROM skills s
      INNER JOIN employee_skills es ON es.skill_id = s.id
      WHERE es.employee_id = $1
    `, [id]);

    // Aggregate data payload
    const completeProfile = {
      ...profileRes.rows[0],
      images: imagesRes.rows,
      skills: skillsRes.rows
    };

    res.json(completeProfile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error fetching employee profile');
  }
});


// ==========================================
// 4. UPDATE EMPLOYEE PROFILE
// ==========================================
// @route   PUT /api/employees/:id
router.put('/:id', protect, async (req, res) => {
  const { department_id, phone, address, designation, salary, skills } = req.body;
  const { id } = req.params;

  try {
    // 1. Update basic information
    await pool.query(
      `UPDATE employee_profiles 
       SET department_id = $1, phone = $2, address = $3, designation = $4, salary = $5 
       WHERE id = $6`,
      [department_id, phone, address, designation, salary, id]
    );

    // 2. Update Skills if explicitly sent
    if (skills) {
      // Wipe out old skills mappings
      await pool.query('DELETE FROM employee_skills WHERE employee_id = $1', [id]);
      
      // Inject updated skill connections
      for (let skillId of skills) {
        await pool.query(
          `INSERT INTO employee_skills (employee_id, skill_id) VALUES ($1, $2)`,
          [id, skillId]
        );
      }
    }

    res.json({ message: 'Employee Profile updated safely!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error updating profile');
  }
});


// ==========================================
// 5. DELETE EMPLOYEE PROFILE
// ==========================================
// @route   DELETE /api/employees/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM employee_profiles WHERE id = $1', [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json({ message: 'Employee profile deleted successfully.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error during deletion');
  }
});

// ==========================================
// 6. STANDALONE MULTIPLE IMAGE UPLOAD API (POST /api/employees/upload)
// ==========================================
router.post('/upload', protect, upload.array('documents', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded.' });
    }

    // Map through the uploaded files to generate their public URLs
    const fileUrls = req.files.map(file => `/uploads/${file.filename}`);

    res.status(200).json({
      message: 'Files uploaded successfully to server!',
      files: fileUrls
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error during multiple file upload');
  }
});

module.exports = router;