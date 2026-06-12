const dotenv = require('dotenv');
const path = require('path');

// Load environment-specific file [cite: 19, 23]
const environment = process.env.NODE_ENV || 'development';
dotenv.config({ path: path.resolve(__dirname, `../../.env.${environment}`) });

module.exports = {
    port: process.env.PORT || 5000,
    env: environment,
    db: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
    },
    jwtSecret: process.env.JWT_SECRET
};