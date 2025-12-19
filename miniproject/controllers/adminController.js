const Admin = require('../models/Admin');
const Product = require('../models/Product');
const Order = require('../models/Order');
const jwt = require('jsonwebtoken');

// Admin Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Please provide email and password' });
        }

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const isPasswordValid = await admin.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { adminId: admin._id, email: admin.email, role: 'admin' },
            process.env.JWT_SECRET || 'your_jwt_secret_key_here_change_this',
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );

        res.status(200).json({
            message: 'Admin login successful',
            token,
            admin: {
                adminId: admin._id,
                email: admin.email
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add Product
exports.addProduct = async (req, res) => {
    try {
        const { name, price, quantity, rating, description, category } = req.body;

        if (!name || price === undefined || quantity === undefined) {
            return res.status(400).json({ error: 'Please provide name, price, and quantity' });
        }

        const product = new Product({
            name,
            price,
            quantity,
            rating: rating || 0,
            description: description || '',
            category: category || ''
        });

        await product.save();

        res.status(201).json({
            message: 'Product added successfully',
            product
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Edit Product
exports.editProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { name, price, quantity, rating, description, category } = req.body;

        const product = await Product.findByIdAndUpdate(
            productId,
            {
                name,
                price,
                quantity,
                rating,
                description,
                category,
                updatedAt: Date.now()
            },
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json({
            message: 'Product updated successfully',
            product
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// View User Orders
exports.viewUserOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('userId', 'name email address')
            .populate('products.productId', 'name price');

        res.status(200).json({
            message: 'User orders retrieved successfully',
            orders
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Delivery Status
exports.updateDeliveryStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ error: 'Please provide status' });
        }

        const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
        }

        const order = await Order.findByIdAndUpdate(
            orderId,
            { status, updatedAt: Date.now() },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(200).json({
            message: 'Order status updated successfully',
            order
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = exports;
