import express from 'express';
import {
  getDashboardStats,
  getUserStats,
  getPostStats,
  getAllUsers,
  getAllPosts,
  updateUserRole,
  deleteUser,
  updatePostStatus,
  deletePostAdmin,
  createPostAdmin,
  updatePostAdmin
} from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';
import User from '../models/User.js';

const router = express.Router();

router.use(protect, adminOnly);

// Stats routes
router.get('/stats/dashboard', getDashboardStats);
router.get('/stats/users', getUserStats);
router.get('/stats/posts', getPostStats);

// Users management
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Posts management
router.get('/posts', getAllPosts);
router.post('/posts', createPostAdmin);
router.put('/posts/:id', updatePostAdmin);
router.put('/posts/:id/status', updatePostStatus);
router.delete('/posts/:id', deletePostAdmin);

// Profile management
router.get('/profile', (req, res) => {
  res.json({ user: req.user });
});

router.put('/profile', async (req, res) => {
  try {
    const { name, email, bio } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email, bio },
      { new: true, runValidators: true }
    );
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(400).json({ message: 'Failed to update profile' });
  }
});

router.put('/change-password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to change password' });
  }
});

// Feedback routes (mock data for now)
router.get('/feedback', (req, res) => {
  res.json({ feedback: [] });
});

router.delete('/feedback/:id', (req, res) => {
  res.json({ message: 'Feedback deleted successfully' });
});

// Activity logs routes (mock data for now)
router.get('/activity', (req, res) => {
  res.json({ logs: [] });
});

export default router;
