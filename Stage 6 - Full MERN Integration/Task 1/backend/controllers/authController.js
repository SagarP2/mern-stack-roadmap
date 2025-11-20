import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    // Create user
    const user = await User.create({ name, email, password });
    
    // Generate token
    const token = generateToken(user._id);
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(400).json({ 
      message: error.name === 'ValidationError' 
        ? Object.values(error.errors).map(val => val.message).join(', ')
        : 'Registration failed'
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check for user email and password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }
    
    // Generate token
    const token = generateToken(user._id);
    
    // Determine login message based on role
    const message = user.role === 'admin' ? 'Admin login successful' : 'Login successful';
    
    res.json({
      message,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ message: 'Login failed' });
  }
};

// Admin login - same as regular login but checks for admin role
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check for user email and password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }
    
    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    
    // Generate token
    const token = generateToken(user._id);
    
    res.json({
      message: 'Admin login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(400).json({ message: 'Admin login failed' });
  }
};

// Create admin user (for initial setup)
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password, adminKey } = req.body;
    
    // Simple admin key check (you should use environment variable)
    if (adminKey !== process.env.ADMIN_CREATION_KEY && adminKey !== 'admin123') {
      return res.status(403).json({ message: 'Invalid admin creation key' });
    }
    
    // Check if admin already exists
    const adminExists = await User.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    // Create admin user
    const admin = await User.create({ 
      name, 
      email, 
      password, 
      role: 'admin' 
    });
    
    // Generate token
    const token = generateToken(admin._id);
    
    res.status(201).json({
      message: 'Admin created successfully',
      token,
      user: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(400).json({ 
      message: error.name === 'ValidationError' 
        ? Object.values(error.errors).map(val => val.message).join(', ')
        : 'Admin creation failed'
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ user });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(400).json({ message: 'Failed to get user data' });
  }
};
