const User = require('../models/User');
const jwt = require('jsonwebtoken');


exports.signup = async (req, res) => {
    try {
        const { name, email, password, address } = req.body;

        if (!name || !email || !password || !address) {
            return res.status(400).json({ error: 'Please provide all required fields: name, email, password, address' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const user = new User({ name, email, password, address });
        await user.save();

        res.status(201).json({ 
            message: 'User registered successfully',
            userId: user._id
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Please provide email and password' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email, role: 'user' },
            process.env.JWT_SECRET || 'your_jwt_secret_key_here_change_this',
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                userId: user._id,
                name: user.name,
                email: user.email,
                address: user.address
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = exports;
