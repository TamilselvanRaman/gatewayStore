const express = require('express');
const router = express.Router();
const { getWishlist, toggleWishlist } = require('../controllers/wishlistController');
const { protect } = require('../middleware/auth');

router.use(protect); // Require login for all wishlist operations

router.get('/', getWishlist);
router.post('/', toggleWishlist);

module.exports = router;
