const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter category name'],
    unique: true,
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Please provide category image name']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Category', CategorySchema);