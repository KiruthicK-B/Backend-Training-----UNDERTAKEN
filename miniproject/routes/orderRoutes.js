const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/order', authMiddleware, orderController.createOrder);


router.get('/view', authMiddleware, orderController.viewProductsAndOrders);


router.get('/view/status', authMiddleware, orderController.viewOrderStatus);


router.delete('/delete/:orderId', authMiddleware, orderController.deleteOrder);

module.exports = router;
