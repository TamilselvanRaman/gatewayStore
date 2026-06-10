const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  manageUserAddress,
  deleteUserAddress,
  getAllUsers,
  toggleUserBlockStatus
} = require('../controllers/authController');
const { protect, isAdmin } = require('../middleware/auth');

// Public endpoints
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected endpoints
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/address', protect, manageUserAddress);
router.delete('/address/:id', protect, deleteUserAddress);

// Admin-only endpoints
router.get('/users', protect, isAdmin, getAllUsers);
router.put('/users/:id/block', protect, isAdmin, toggleUserBlockStatus);

module.exports = router;
