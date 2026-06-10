const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getAdminStats
} = require('../controllers/orderController');
const { protect, isAdmin } = require('../middleware/auth');

router.use(protect);

router.post('/', createOrder);
router.get('/myorders', getMyOrders);
router.get('/admin/stats', isAdmin, getAdminStats);
router.get('/:id', getOrderById);
router.get('/', isAdmin, getAllOrders);
router.put('/:id', updateOrderStatus);

module.exports = router;