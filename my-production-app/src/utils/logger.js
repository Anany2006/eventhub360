const winston = require('winston');
const path = require('path');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.json()
    ),
    transports: [
        // Save execution errors separately for quick debugging
        new winston.transports.File({ filename: path.join(__dirname, '../../logs/error.log'), level: 'error' }),
        // Capture all background transactions in a general log file
        new winston.transports.File({ filename: path.join(__dirname, '../../logs/combined.log') }),
    ],
});

// Also output to the console during local development for visibility
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        ),
    }));
}

module.exports = logger;