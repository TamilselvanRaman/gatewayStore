const User = require('../models/User');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'wishlist',
      select: 'title price discountPrice images stock brand rating'
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: user.wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle product in wishlist (Add/Remove)
// @route   POST /api/wishlist
// @access  Private
const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Please provide product ID' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isAlreadyWishlisted = user.wishlist.includes(productId);

    if (isAlreadyWishlisted) {
      // Remove product
      user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    } else {
      // Add product
      user.wishlist.push(productId);
    }

    await user.save();

    // Fetch and return updated populated list
    const updatedUser = await User.findById(req.user._id).populate({
      path: 'wishlist',
      select: 'title price discountPrice images stock brand rating'
    });

    res.json({
      success: true,
      message: isAlreadyWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
      data: updatedUser.wishlist
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getWishlist,
  toggleWishlist
};
