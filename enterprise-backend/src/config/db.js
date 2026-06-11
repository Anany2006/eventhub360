const { Pool } = require('pg');
require('dotenv').config();

console.log("Checking DB URL connection string:", process.env.DATABASE_URL ? "Found! ✅" : "Missing! ❌");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;