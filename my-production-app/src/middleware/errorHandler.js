const config = require('../config/env');
const logger = require('../utils/logger'); // Import the logger

const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;
    if (!statusCode) statusCode = 500;

    // 🌟 AUTOMATICALLY LOG ERRORS
    logger.error(`[${req.method}] ${req.originalUrl} - Status: ${statusCode} - Error: ${message}`);

    const response = {
        success: false,
        status: statusCode,
        message: message || "Internal Server Error",
        ...(config.env === 'development' && { stack: err.stack }) 
    };

    res.status(statusCode).json(response);
};

module.exports = errorHandler;