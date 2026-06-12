const express = require('express');
const router = express.Router();
const employeeController = require('../../controllers/employee.controller');
const cacheMiddleware = require('../../middleware/cache');
const upload = require('../../middleware/upload');

// Import your Joi middleware validation runner
const validate = require('../../middleware/validate');
const { createEmployeeSchema } = require('../../validators/employee.validator');

// GET /api/v1/employees
router.get('/', employeeController.getAllEmployees);

// POST /api/v1/employees (Validation middleware runs BEFORE the controller)
router.post('/', validate(createEmployeeSchema), (req, res) => {
    res.status(201).json({ success: true, message: "Employee validated and created!", data: req.body });
});

// Cached corporate configurations route (Module 7)
router.get('/roles', cacheMiddleware, (req, res) => {
    const corporateRoles = ["Software Engineer", "Product Manager", "HR Specialist", "DevOps Lead"];
    
    // Simulating database delivery on initial request load
    res.status(200).json({ 
        success: true, 
        source: 'database_engine', 
        data: corporateRoles 
    });
});

// GET /api/v1/employees/dashboard
router.get('/dashboard', employeeController.getEmployeeDashboard);

// POST /api/v1/employees/upload-asset (Module 13 File Ingestion pipeline)
router.post('/upload-asset', upload.single('document'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "Please select an asset file to transfer." });
    }
    
    res.status(200).json({
        success: true,
        message: "Asset safely transferred, scanned, and saved to secure storage.",
        fileDetails: {
            assignedName: req.file.filename,
            originalName: req.file.originalname,
            storagePath: req.file.path,
            fileSizeInBytes: req.file.size
        }
    });
});

module.exports = router;