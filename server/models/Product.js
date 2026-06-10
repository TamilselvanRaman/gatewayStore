const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please enter product title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please enter product description']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please specify product category']
  },
  brand: {
    type: String,
    required: [true, 'Please enter brand name'],
    trim: true
  },
  images: [{
    type: String,
    required: [true, 'Please upload at least one image']
  }],
  price: {
    type: Number,
    required: [true, 'Please enter product price'],
    min: [0, 'Price must be non-negative']
  },
  discountPrice: {
    type: Number,
    default: 0,
    validate: {
      validator: function(val) {
        return val <= this.price;
      },
      message: 'Discount price must be less than or equal to regular price'
    }
  },
  stock: {
    type: Number,
    required: [true, 'Please enter product stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  rating: {
    type: Number,
    default: 5,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating must be at most 5']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', ProductSchema);