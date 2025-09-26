const pool = require("../config/db");

async function insertSubmission(sessionId, userId) {
  await pool.query(
    "INSERT INTO submissions(session_id, user_id, timestamp) VALUES($1,$2,NOW())",
    [sessionId, userId]
  );
}

module.exports = { insertSubmission };
