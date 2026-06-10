const express = require('express');
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { protect, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getCategories);
router.post('/', protect, isAdmin, upload.single('image'), createCategory);
router.put('/:id', protect, isAdmin, upload.single('image'), updateCategory);
router.delete('/:id', protect, isAdmin, deleteCategory);

module.exports = router;