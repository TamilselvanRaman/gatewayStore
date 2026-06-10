const Cart = require('../models/Cart');
const Product = require('../models/Product');

const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'products.product',
      select: 'title price discountPrice images stock brand'
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        products: []
      });
    }

    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Please provide product ID' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, products: [] });
    }

    const itemIndex = cart.products.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex > -1) {

      cart.products[itemIndex].quantity += Number(quantity);
    } else {

      cart.products.push({ product: productId, quantity: Number(quantity) });
    }

    await cart.save();
    

    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'products.product',
      select: 'title price discountPrice images stock brand'
    });

    res.json({ success: true, data: updatedCart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateCartQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const productId = req.params.id;

    if (quantity === undefined || Number(quantity) < 1) {
      return res.status(400).json({ success: false, message: 'Please enter valid quantity (minimum 1)' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const itemIndex = cart.products.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.products[itemIndex].quantity = Number(quantity);
      await cart.save();

      const updatedCart = await Cart.findById(cart._id).populate({
        path: 'products.product',
        select: 'title price discountPrice images stock brand'
      });

      res.json({ success: true, data: updatedCart });
    } else {
      res.status(404).json({ success: false, message: 'Product not found in cart' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const productId = req.params.id;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.products = cart.products.filter(
      item => item.product.toString() !== productId
    );

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'products.product',
      select: 'title price discountPrice images stock brand'
    });

    res.json({ success: true, data: updatedCart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.products = [];
      await cart.save();
    }
    res.json({ success: true, message: 'Cart cleared successfully', data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart
};