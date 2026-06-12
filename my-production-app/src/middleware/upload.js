const multer = require('multer');
const path = require('path');
const ApiError = require('../utils/ApiError');

// 1. Storage Engine Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Segregate assets dynamically into folders based on form field input
        let uploadFolder = 'uploads/documents/';
        if (file.fieldname === 'avatar') {
            uploadFolder = 'uploads/avatars/';
        }
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        // Append a unique timestamp to prevent file collision overwrites
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

// 2. Security File Guard Filters
const fileFilter = (req, file, cb) => {
    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.pdf', '.docx'];
    const fileExt = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(fileExt)) {
        cb(null, true); // Safe file extension matched!
    } else {
        cb(new ApiError(400, `Unsupported file format. Allowed formats: ${allowedExtensions.join(', ')}`), false);
    }
};

// 3. Assemble and Export the Middleware Instance
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // Hard ceiling limit at 5MB per upload
    }
});

module.exports = upload;