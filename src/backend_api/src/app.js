const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const qrRoutes = require("./routes/qrRoutes");
const submitRoutes = require("./routes/submitRoutes");
const errorHandler = require("./middleware/errorHandler");
const path = require("path");
const cors = require('cors');

const app = express();
app.use(bodyParser.json());

// Enable CORS for your frontend
app.use(cors({
    origin: 'http://localhost:5173', // frontend URL
    methods: ['GET', 'POST'],       // allowed HTTP methods
    credentials: true               // if you want cookies/auth headers
}));



app.use("/qrcodes", express.static(path.join(__dirname, "../public/qrcodes")));

// Routes
app.get("/", (req, res) => {
    res.json({ "msg": "QR code Database intigration pipeline", "status": "ok" })
})
app.use("/api/auth", authRoutes);
app.use("/api/qr", qrRoutes);
app.use("/api/qr", submitRoutes);

// Error handler (last middleware)
app.use(errorHandler);

module.exports = app;
