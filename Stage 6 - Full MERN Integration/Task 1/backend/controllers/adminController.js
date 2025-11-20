import User from '../models/User.js';
import Post from '../models/Post.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const publishedPosts = await Post.countDocuments({ status: 'published' });
    
    res.json({
      totalUsers,
      totalPosts,
      publishedPosts,
      draftPosts: totalPosts - publishedPosts
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Failed to get dashboard stats' });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const total = await User.countDocuments();
    const admins = await User.countDocuments({ role: 'admin' });
    const users = await User.countDocuments({ role: 'user' });
    
    res.json({ total, admins, users });
  } catch (error) {
    console.error('User stats error:', error);
    res.status(500).json({ message: 'Failed to get user stats' });
  }
};

export const getPostStats = async (req, res) => {
  try {
    const total = await Post.countDocuments();
    const published = await Post.countDocuments({ status: 'published' });
    const drafts = await Post.countDocuments({ status: 'draft' });
    
    res.json({ total, published, drafts });
  } catch (error) {
    console.error('Post stats error:', error);
    res.status(500).json({ message: 'Failed to get post stats' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const users = await User.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const totalUsers = await User.countDocuments();
    
    res.json({
      users,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Failed to get users' });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const posts = await Post.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const totalPosts = await Post.countDocuments();
    
    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts
    });
  } catch (error) {
    console.error('Get all posts error:', error);
    res.status(500).json({ message: 'Failed to get posts' });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.params.id;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      message: 'User role updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(400).json({ message: 'Failed to update user role' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Prevent admin from deleting themselves
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Delete user's posts
    await Post.deleteMany({ author: userId });
    
    // Delete user
    await User.findByIdAndDelete(userId);
    
    res.json({ message: 'User and associated posts deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

export const updatePostStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const postId = req.params.id;
    
    if (!['draft', 'published'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const post = await Post.findByIdAndUpdate(
      postId,
      { status },
      { new: true, runValidators: true }
    ).populate('author', 'name email');
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json({
      message: 'Post status updated successfully',
      post
    });
  } catch (error) {
    console.error('Update post status error:', error);
    res.status(400).json({ message: 'Failed to update post status' });
  }
};

export const deletePostAdmin = async (req, res) => {
  try {
    const postId = req.params.id;
    
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    await Post.findByIdAndDelete(postId);
    
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post admin error:', error);
    res.status(500).json({ message: 'Failed to delete post' });
  }
};

export const createPostAdmin = async (req, res) => {
  try {
    const { title, content, introduction, conclusion, callToAction } = req.body;
    
    const post = await Post.create({
      title,
      content,
      introduction,
      conclusion,
      callToAction,
      author: req.user._id
    });
    
    const populatedPost = await Post.findById(post._id).populate('author', 'name email');
    
    res.status(201).json({
      message: 'Post created successfully',
      post: populatedPost
    });
  } catch (error) {
    console.error('Create post admin error:', error);
    res.status(400).json({ 
      message: error.name === 'ValidationError' 
        ? Object.values(error.errors).map(val => val.message).join(', ')
        : 'Failed to create post'
    });
  }
};

export const updatePostAdmin = async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, content, introduction, conclusion, callToAction } = req.body;
    
    const post = await Post.findByIdAndUpdate(
      postId,
      { title, content, introduction, conclusion, callToAction },
      { new: true, runValidators: true }
    ).populate('author', 'name email');
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json({
      message: 'Post updated successfully',
      post
    });
  } catch (error) {
    console.error('Update post admin error:', error);
    res.status(400).json({ 
      message: error.name === 'ValidationError' 
        ? Object.values(error.errors).map(val => val.message).join(', ')
        : 'Failed to update post'
    });
  }
};
