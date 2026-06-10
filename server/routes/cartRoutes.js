const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

router.use(protect); // All cart routes require login

router.get('/', getCart);
router.post('/', addToCart);
router.put('/:id', updateCartQuantity);
router.delete('/:id', removeFromCart);
router.delete('/', clearCart);

module.exports = router;
