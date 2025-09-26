const crypto = require("crypto");

const HMAC_SECRET = "supersecret_hmac_key";

function signPayload(sessionId, nonce, expiresAt) {
  const payload = `${sessionId}|${nonce}|${expiresAt}`;
  return crypto.createHmac("sha256", HMAC_SECRET).update(payload).digest("base64url");
}

module.exports = { signPayload };
