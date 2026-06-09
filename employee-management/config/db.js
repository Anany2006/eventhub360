const { Pool } = require('pg');
require('dotenv').config();

// Print to console to make sure it's reading your connection string
console.log("Checking connection string:", process.env.DATABASE_URL ? "Found!" : "Not Found!");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client from pool:', err.stack);
  }
  console.log('Successfully connected to Neon PostgreSQL database!');
  release();
});

module.exports = pool;