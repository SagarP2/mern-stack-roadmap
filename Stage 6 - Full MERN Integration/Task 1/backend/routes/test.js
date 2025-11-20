import express from 'express';
import User from '../models/User.js';
import Post from '../models/Post.js';

const router = express.Router();

// Test all API endpoints
router.get('/endpoints', (req, res) => {
  const endpoints = {
    auth: {
      'POST /api/auth/register': 'Register new user',
      'POST /api/auth/login': 'Login user/admin',
      'POST /api/auth/admin/create': 'Create admin user',
      'GET /api/auth/me': 'Get current user (protected)'
    },
    posts: {
      'GET /api/posts': 'Get all published posts',
      'GET /api/posts/:id': 'Get single post',
      'POST /api/posts': 'Create post (protected)',
      'PUT /api/posts/:id': 'Update post (protected)',
      'DELETE /api/posts/:id': 'Delete post (protected)',
      'GET /api/posts/my-posts': 'Get user posts (protected)'
    },
    users: {
      'GET /api/users/profile': 'Get user profile (protected)',
      'PUT /api/users/profile': 'Update user profile (protected)',
      'PUT /api/users/change-password': 'Change password (protected)'
    },
    admin: {
      'GET /api/admin/stats/dashboard': 'Dashboard stats (admin)',
      'GET /api/admin/stats/users': 'User stats (admin)',
      'GET /api/admin/stats/posts': 'Post stats (admin)',
      'GET /api/admin/users': 'Get all users (admin)',
      'PUT /api/admin/users/:id/role': 'Update user role (admin)',
      'DELETE /api/admin/users/:id': 'Delete user (admin)',
      'GET /api/admin/posts': 'Get all posts (admin)',
      'POST /api/admin/posts': 'Create post as admin (admin)',
      'PUT /api/admin/posts/:id': 'Update post as admin (admin)',
      'PUT /api/admin/posts/:id/status': 'Update post status (admin)',
      'DELETE /api/admin/posts/:id': 'Delete post as admin (admin)',
      'GET /api/admin/profile': 'Get admin profile (admin)',
      'PUT /api/admin/profile': 'Update admin profile (admin)',
      'PUT /api/admin/change-password': 'Change admin password (admin)',
      'GET /api/admin/feedback': 'Get feedback (admin)',
      'DELETE /api/admin/feedback/:id': 'Delete feedback (admin)',
      'GET /api/admin/activity': 'Get activity logs (admin)'
    },
    test: {
      'GET /api/test/endpoints': 'List all endpoints',
      'GET /api/test/database': 'Test database connection',
      'POST /api/test/seed': 'Seed test data'
    }
  };

  res.json({
    message: 'MERN Blog API Endpoints',
    baseUrl: `${req.protocol}://${req.get('host')}`,
    endpoints
  });
});

// Test database connection
router.get('/database', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const postCount = await Post.countDocuments();
    
    res.json({
      message: 'Database connection successful',
      collections: {
        users: userCount,
        posts: postCount
      },
      status: 'Connected'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Seed test data
router.post('/seed', async (req, res) => {
  try {
    // Create test users
    const testUsers = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        role: 'user'
      }
    ];

    const users = [];
    for (const userData of testUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        const user = await User.create(userData);
        users.push(user);
      }
    }

    // Create test posts
    if (users.length > 0) {
      const testPosts = [
        {
          title: 'Getting Started with React',
          content: 'React is a powerful JavaScript library for building user interfaces...',
          introduction: 'Learn the basics of React development',
          conclusion: 'React makes building UIs easier and more efficient',
          author: users[0]._id,
          status: 'published'
        },
        {
          title: 'Advanced JavaScript Concepts',
          content: 'JavaScript has many advanced features that can improve your code...',
          introduction: 'Explore advanced JavaScript techniques',
          conclusion: 'Mastering these concepts will make you a better developer',
          author: users[1] ? users[1]._id : users[0]._id,
          status: 'published'
        }
      ];

      for (const postData of testPosts) {
        const existingPost = await Post.findOne({ title: postData.title });
        if (!existingPost) {
          await Post.create(postData);
        }
      }
    }

    const finalUserCount = await User.countDocuments();
    const finalPostCount = await Post.countDocuments();

    res.json({
      message: 'Test data seeded successfully',
      created: {
        users: users.length,
        posts: testPosts.length
      },
      total: {
        users: finalUserCount,
        posts: finalPostCount
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to seed test data',
      error: error.message
    });
  }
});

export default router;
