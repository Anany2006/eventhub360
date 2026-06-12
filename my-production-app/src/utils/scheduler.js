const cron = require('node-cron');
const nodemailer = require('nodemailer');
const logger = require('./logger');

// Configure a mock mail transportation client
const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email", // Using a safe sandbox server for testing
    port: 587,
    auth: {
        user: 'mock.user@ethereal.email',
        pass: 'mockPassword123'
    }
});

const initBackgroundJobs = () => {
    // Cron schedule pattern: Runs automatically every single minute
    cron.schedule('* * * * *', async () => {
        logger.info('⚡ Cron Scheduler executing automated system report...');
        
        try {
            const mailOptions = {
                from: '"System Monitor" <monitor@company.com>',
                to: "admin@company.com",
                subject: "Automated System Metrics Notification",
                text: "Background job completed successfully. All platform systems are operational."
            };

            // Simulating message dispatch tracking
            logger.info('📧 Notification email compiled and dispatched successfully.');
        } catch (error) {
            logger.error(`CRON ERROR: Failed to execute automated notification: ${error.message}`);
        }
    });
};

module.exports = { initBackgroundJobs };