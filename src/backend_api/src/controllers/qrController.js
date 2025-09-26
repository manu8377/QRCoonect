const { v4: uuidv4 } = require("uuid");
const { signPayload } = require("../config/crypto");
const { createSession, findSessionById } = require("../models/sessions");
const QRCode = require("qrcode");


async function generateQR(req, res) {
  try {
    const sessionId = uuidv4();
    const nonce = uuidv4();
    const expiryInterval = 30;
    const expiresAt = new Date(Date.now() + expiryInterval * 1000); // 30s TTL

    const sig = signPayload(sessionId, nonce, expiresAt.toISOString());
    await createSession(sessionId, nonce, expiresAt);

    const qrData = JSON.stringify({
      session_id: sessionId,
      nonce,
      expires_at: expiresAt,
      sig,
    });

    // ✅ Generate QR as base64 (no file)
    const qrBase64 = await QRCode.toDataURL(qrData);

    return res.json({
      status: "success",
      session_id: sessionId,
      qr_payload: { session_id: sessionId, nonce, expires_at: expiresAt, expiryInterval, sig },
      qr_image_base64: qrBase64, // directly usable in <img>
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", code: "SERVER_ERROR" });
  }
}

async function checkStatus(req, res) {
  try {
    const sessionId = req.params.session_id;
    const session = await findSessionById(sessionId);

    if (!session) {
      return res.status(404).json({ status: "error", code: "SESSION_NOT_FOUND" });
    }

    return res.json({
      session_id: session.id,
      status: session.status,
      expires_at: session.expires_at,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", code: "SERVER_ERROR" });
  }
}

module.exports = { generateQR, checkStatus };
