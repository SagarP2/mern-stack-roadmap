import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';
import adminRoutes from './routes/admin.js';
import testRoutes from './routes/test.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/test', testRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// 404 handler - must be last
app.use('*', (req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Database connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mern-blog')
  .then(async () => {
    console.log('MongoDB connected');
    
    // Create default admin user if it doesn't exist
    try {
      const User = (await import('./models/User.js')).default;
      
      const existingAdmin = await User.findOne({ role: 'admin' });
      if (!existingAdmin) {
        const adminData = {
          name: 'Admin User',
          email: 'admin@example.com',
          password: 'admin123',
          role: 'admin'
        };
        
        await User.create(adminData);
        console.log('✅ Default admin user created:');
        console.log('   Email: admin@example.com');
        console.log('   Password: admin123');
      } else {
        console.log('✅ Admin user already exists:', existingAdmin.email);
      }
    } catch (error) {
      console.error('❌ Error creating default admin:', error.message);
    }
  })
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
