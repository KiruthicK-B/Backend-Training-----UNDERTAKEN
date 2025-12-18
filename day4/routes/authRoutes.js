const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
 
const router = express.Router();


// ================= SIGNUP =================
router.post("/signup", async (req, res) => {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        name,
        email,
        password: hashedPassword,
        role
    });

    await user.save();

    res.json({ message: "Signup successful" });
});


// ================= LOGIN =================
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.json({ token });
});


// ================= PROTECTED PROFILE =================
router.get("/profile", auth, async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
});


// ================= ADMIN ROUTE =================
router.get("/admin/users", auth, admin, async (req, res) => {
    const users = await User.find().select("-password");
    res.json(users);
});


// /**
//  * @swagger
//  * /api/auth/signup:
//  *   post:
//  *     summary: Signup new user
//  *     tags: [Auth]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *               email:
//  *                 type: string
//  *               password:
//  *                 type: string
//  *               role:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: Signup successful
//  */

// /**
//  * @swagger
//  * /api/auth/login:
//  *   post:
//  *     summary: Login user and get JWT token
//  *     tags: [Auth]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               email:
//  *                 type: string
//  *               password:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: JWT token returned
//  */

// /**
//  * @swagger
//  * /api/auth/profile:
//  *   get:
//  *     summary: Get logged-in user profile
//  *     tags: [Auth]
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: User profile data
//  *       401:
//  *         description: Unauthorized
//  */

// /**
//  * @swagger
//  * /api/auth/admin/users:
//  *   get:
//  *     summary: Admin – Get all users
//  *     tags: [Admin]
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: List of users
//  *       403:
//  *         description: Admin access denied
//  */


module.exports = router;
