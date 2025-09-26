const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "qr_system",
  password: "Atul@Payal",
  port: 5432,
});

module.exports = pool;
