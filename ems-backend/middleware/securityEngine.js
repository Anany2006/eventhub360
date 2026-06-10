const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15-minute tracking windows
    max: 100, // Caps maximum requests per window window per IP address
    message: { error: 'Too many requests from this IP, please try again later.' }
});

const helmetGuard = helmet();

module.exports = { apiLimiter, helmetGuard };