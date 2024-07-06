const { Pool } = require("pg");

const pool = new Pool({
  port: 5432,
  host: "localhost",
  user: "postgres",
  password: "",
  database: "employees",
});

module.exports = pool;
