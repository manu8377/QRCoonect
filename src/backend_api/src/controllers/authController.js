const { v4: uuidv4 } = require('uuid');
const { signToken } = require("../config/jwt");
const pool = require('../config/db');
const bcrypt = require('bcrypt');

// -------------------- REGISTER --------------------
async function register(req, res) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ status: "error", message: "Missing required fields" });
    }

    try {
        // Check if user already exists
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length > 0) {
            return res.status(409).json({ status: "error", message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate unique user_id automatically
        const user_id = uuidv4();

        // Insert new user
        await pool.query(
            'INSERT INTO users(id, name, email, password) VALUES($1, $2, $3, $4)',
            [user_id, name, email, hashedPassword]
        );

        return res.json({ status: "success", message: "User registered successfully", user_id });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: "error", message: "Server error" });
    }
}

// -------------------- LOGIN --------------------
async function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ status: "error", message: "Email and password are required" });
    }

    try {
        // Check if user exists
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(401).json({ status: "error", message: "Invalid credentials" });
        }

        const userData = user.rows[0];

        // Verify password
        const isMatch = await bcrypt.compare(password, userData.password);
        if (!isMatch) {
            return res.status(401).json({ status: "error", message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = signToken({ user_id: userData.id });

        return res.json({ status: "success", token });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: "error", message: "Server error" });
    }
}

module.exports = { register, login };
