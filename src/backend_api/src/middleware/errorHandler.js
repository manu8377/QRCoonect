function errorHandler(err, req, res, next) {
  console.error("Unhandled Error:", err);
  res.status(500).json({ status: "error", code: "SERVER_ERROR" });
}

module.exports = errorHandler;
