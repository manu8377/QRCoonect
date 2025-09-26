const { verifyToken } = require("../config/jwt");
const { findSessionById, updateSessionStatus } = require("../models/sessions");
const { insertSubmission } = require("../models/submissions");
const { broadcastToClients } = require("../services/websocket");

async function submit(req, res) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ status: "error", code: "NO_JWT" });
  }

  const token = authHeader.split(" ")[1];
  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    console.log(err)
    return res.status(401).json({ status: "error", code: "INVALID_JWT" });
  }

  const { session_id, nonce, user_id } = req.body;

  try {
    const session = await findSessionById(session_id);
    if (!session) {
      return res.status(404).json({ status: "error", code: "SESSION_NOT_FOUND" });
    }

    if (new Date() > new Date(session.expires_at)) {
      return res.status(410).json({ status: "error", code: "QR_EXPIRED" });
    }

    if (session.status === "submitted") {
      return res.status(409).json({ status: "error", code: "DUPLICATE_SUBMISSION" });
    }

    await insertSubmission(session_id, user_id);
    await updateSessionStatus(session_id, "submitted");

    // Push WebSocket event
    broadcastToClients(session_id, {
      event: "submission_received",
      session_id,
      user_id,
      status: "submitted",
      timestamp: new Date().toISOString(),
    });

    return res.json({
      status: "success",
      session_id,
      user_id,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", code: "SERVER_ERROR" });
  }
}

module.exports = { submit };
