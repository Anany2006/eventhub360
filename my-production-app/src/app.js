const express = require('express');
const config = require('./config/env');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const { initBackgroundJobs } = require('./utils/scheduler'); // Import scheduler
const logger = require('./utils/logger'); // Import logger

const app = express();

app.use(express.json());
app.use('/api', routes);

app.use((req, res, next) => {
    const ApiError = require('./utils/ApiError');
    next(new ApiError(404, 'The requested API route path does not exist.'));
});

app.use(errorHandler);

// 🌟 INITIALIZE CRON JOBS HERE
initBackgroundJobs();

app.listen(config.port, () => {
    logger.info(`🚀 Production Ready Engine active on port ${config.port} [ENV: ${config.env}]`);
});