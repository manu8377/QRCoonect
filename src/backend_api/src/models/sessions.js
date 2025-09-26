const pool = require("../config/db");

async function createSession(id, nonce, expiresAt) {
  await pool.query(
    "INSERT INTO sessions(id, nonce, status, expires_at) VALUES($1,$2,$3,$4)",
    [id, nonce, "pending", expiresAt]
  );
}

async function findSessionById(id) {
  const result = await pool.query("SELECT * FROM sessions WHERE id=$1", [id]);
  return result.rows[0];
}

async function updateSessionStatus(id, status) {
  await pool.query("UPDATE sessions SET status=$1 WHERE id=$2", [status, id]);
}

module.exports = { createSession, findSessionById, updateSessionStatus };
