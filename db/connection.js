const { Pool } = require("pg");

// Create a new Pool instance to manage database connections
const db = new Pool({
  host: "localhost",
  user: "postgres",
  password: "Alfredo514@1",
  database: "employees_db",
});

// Export the db instance to be used in other modules
module.exports = { db };
