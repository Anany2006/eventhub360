const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Required for secure cloud connection to Neon
});

pool.on('connect', () => {
    console.log('⚡ Neon PostgreSQL database connected successfully!');
});

module.exports = pool;