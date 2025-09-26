const express = require("express");
const { generateQR, checkStatus } = require("../controllers/qrController");
const router = express.Router();

router.post("/generate", generateQR);
router.get("/status/:session_id", checkStatus);

module.exports = router;
