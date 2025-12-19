const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');


exports.createOrder = async (req, res) => {
    try {
        const { products } = req.body;
        const userId = req.user.userId;

        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: 'Please provide products array with productId and quantity' });
        }

        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        let totalAmount = 0;
        const orderProducts = [];

        // Validate and prepare products
        for (const item of products) {
            const product = await Product.findById(item.productId);

            if (!product) {
                return res.status(404).json({ error: `Product with ID ${item.productId} not found` });
            }

            if (product.quantity < item.quantity) {
                return res.status(400).json({ error: `Insufficient quantity for product: ${product.name}` });
            }

            orderProducts.push({
                productId: item.productId,
                quantity: item.quantity,
                price: product.price
            });

            totalAmount += product.price * item.quantity;

            // Reduce product quantity
            product.quantity -= item.quantity;
            await product.save();
        }

        const order = new Order({
            userId,
            products: orderProducts,
            totalAmount,
            deliveryAddress: user.address,
            status: 'pending'
        });

        await order.save();

        res.status(201).json({
            message: 'Order placed successfully',
            order: await order.populate('products.productId', 'name price')
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// View Products and User Orders
exports.viewProductsAndOrders = async (req, res) => {
    try {
        const userId = req.user.userId;

       
        const products = await Product.find();


        const orders = await Order.find({ userId })
            .populate('products.productId', 'name price description')
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: 'Products and orders retrieved successfully',
            products,
            userOrders: orders
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.viewOrderStatus = async (req, res) => {
    try {
        const userId = req.user.userId;

        const orders = await Order.find({ userId })
            .select('_id status totalAmount createdAt updatedAt')
            .sort({ createdAt: -1 });

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found' });
        }

        res.status(200).json({
            message: 'Order statuses retrieved successfully',
            orders
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.userId;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        
        if (order.userId.toString() !== userId) {
            return res.status(403).json({ error: 'Not authorized to delete this order' });
        }

        
        if (order.status !== 'pending') {
            return res.status(400).json({ error: 'Can only delete pending orders' });
        }

        
        for (const item of order.products) {
            const product = await Product.findById(item.productId);
            if (product) {
                product.quantity += item.quantity;
                await product.save();
            }
        }

        await Order.findByIdAndDelete(orderId);

        res.status(200).json({
            message: 'Order deleted successfully',
            orderId
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = exports;
