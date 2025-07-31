const express = require('express');
const router = express.Router();

const {
  placeOrder,
  getOrderDetails,
  getUserOrders,
  getAllOrders,
  getGuestOrders
} = require('../controllers/orderController');

const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// POST /api/orders/place
router.post('/place', placeOrder);

// GET /api/orders/:orderId/details
router.get('/:orderId/details', getOrderDetails);

// GET /api/orders/user/:userId (protected)
router.get('/user/:userId', verifyToken, getUserOrders);

// GET /api/orders/guest?phone=XXXXXXXXXX
router.get('/guest', getGuestOrders);

// GET /api/orders/all
router.get('/all', verifyToken, verifyAdmin, getAllOrders);

module.exports = router;



