const jwt = require("jsonwebtoken");

const JWT_SECRET = "supersecret_jwt_key";

function signToken(payload, expiresIn = "15m") {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { signToken, verifyToken };
