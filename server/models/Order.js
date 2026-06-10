const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  title: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true } // Price at the time of purchase
});

const OrderAddressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true, default: 'India' }
});

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [OrderItemSchema],
  address: OrderAddressSchema,
  paymentMethod: {
    type: String,
    enum: ['COD', 'Card', 'UPI', 'NetBanking'],
    default: 'COD'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  trackingNumber: {
    type: String,
    default: function() {
      // Generate standard track ID
      return 'GTS-' + Math.floor(100000 + Math.random() * 900000);
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', OrderSchema);
