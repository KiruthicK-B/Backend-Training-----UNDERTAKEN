const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');

router.post('/login', adminController.login);


router.post('/add', adminAuthMiddleware, adminController.addProduct);


router.put('/edit/:productId', adminAuthMiddleware, adminController.editProduct);


router.get('/view', adminAuthMiddleware, adminController.viewUserOrders);


router.put('/update/:orderId', adminAuthMiddleware, adminController.updateDeliveryStatus);

module.exports = router;
