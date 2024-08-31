// db.js
require("dotenv").config();
const { Pool } = require("pg");

// Create a pool instance
const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
  max: 10, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  ssl: {
    rejectUnauthorized: false, // Allows connection without verifying SSL certificate (for development)
  },
});

// Function to query the database
const query = (text, params) => pool.query(text, params);

// Handle errors
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

// Test the connection on startup
const testConnection = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("Connected to the database successfully!");
  } catch (err) {
    console.error("Failed to connect to the database:", err);
    process.exit(-1);
  }
};

// Call the testConnection function when the module is loaded
testConnection();

module.exports = {
  query,
  pool,
};
