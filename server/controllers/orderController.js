const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const User = require('../models/User');

// @desc    Create new order (Checkout)
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { products, address, paymentMethod, totalAmount } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ success: false, message: 'No products in order' });
    }

    if (!address) {
      return res.status(400).json({ success: false, message: 'Please provide shipping address' });
    }

    // Double-check stock availability and adjust stock
    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.title}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product: ${product.title}. Only ${product.stock} items left.`
        });
      }

      // Decrement stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Set payment status based on method
    const paymentStatus = paymentMethod === 'Card' || paymentMethod === 'UPI' ? 'Paid' : 'Pending';

    const order = await Order.create({
      user: req.user._id,
      products,
      address,
      paymentMethod,
      paymentStatus,
      totalAmount
    });

    // Clear cart upon successful order
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.products = [];
      await cart.save();
    }

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Authorize: Admin or Owner
    if (
      req.user.role !== 'admin' &&
      order.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Authorization: Admin can update anything. Customer can only cancel their own Pending order.
    if (req.user.role !== 'admin') {
      if (order.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to modify this order' });
      }

      if (orderStatus !== 'Cancelled') {
        return res.status(400).json({ success: false, message: 'Customers can only cancel orders' });
      }

      if (order.orderStatus !== 'Pending') {
        return res.status(400).json({ success: false, message: 'Only Pending orders can be cancelled' });
      }
    }

    // If order is transitioning to Cancelled, restore stock
    if (orderStatus === 'Cancelled' && order.orderStatus !== 'Cancelled') {
      for (const item of order.products) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
    }

    order.orderStatus = orderStatus || order.orderStatus;
    if (req.user.role === 'admin' && paymentStatus) {
      order.paymentStatus = paymentStatus;
    } else if (orderStatus === 'Cancelled') {
      order.paymentStatus = 'Failed'; // Set failed/refund pending on cancel
    }

    const updatedOrder = await order.save();
    res.json({ success: true, data: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get admin statistics
// @route   GET /api/orders/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments({});
    const totalOrders = await Order.countDocuments({});
    const totalCustomers = await User.countDocuments({ role: 'customer' });

    // Calculate total revenue
    const paidOrders = await Order.find({ paymentStatus: 'Paid' });
    const totalRevenue = paidOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Dynamic sales analytics over last 6 months (mock aggregation or simple logic)
    // For simplicity, group orders by month
    const analytics = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$totalAmount" },
          sales: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedAnalytics = analytics.map(item => ({
      month: months[item._id - 1] || 'Unknown',
      revenue: item.revenue,
      sales: item.sales
    }));

    res.json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalCustomers,
        totalRevenue,
        analytics: formattedAnalytics.length > 0 ? formattedAnalytics : [
          { month: 'Jun', revenue: totalRevenue, sales: totalOrders }
        ]
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getAdminStats
};
