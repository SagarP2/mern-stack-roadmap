import Post from '../models/Post.js';
import User from '../models/User.js';


export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const query = { status: 'published' };
    
    const posts = await Post.find(query)
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const totalPosts = await Post.countDocuments(query);
    const totalPages = Math.ceil(totalPosts / limit);
    
    res.json({
      posts,
      currentPage: page,
      totalPages,
      totalPosts,
      hasMore: page < totalPages
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name email');
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Increment view count
    await Post.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    
    res.json(post);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'Failed to fetch post' });
  }
};

export const createPost = async (req, res) => {
  try {
    // Accept both old and new fields
    const {
      title,
      content,
      introduction = '',
      conclusion = '',
      callToAction = '',
      status = 'published'
    } = req.body;

    // Validation
    if (!title || typeof title !== 'string' || title.length > 200) {
      return res.status(400).json({ message: 'Title is required and must be <= 200 characters.' });
    }
    // Validate content
    if (!content) {
      return res.status(400).json({ message: 'Content is required.' });
    }

    const post = await Post.create({
      title,
      content,
      introduction,
      conclusion,
      callToAction,
      status,
      author: req.user._id
    });

    await post.populate('author', 'name email');

    res.status(201).json({
      message: 'Post created successfully',
      ...post.toObject()
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(400).json({ 
      message: error.name === 'ValidationError' 
        ? Object.values(error.errors).map(val => val.message).join(', ')
        : 'Failed to create post'
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if user owns the post or is admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }
    
    const {
      title,
      content,
      introduction,
      mainBody,
      conclusion,
      callToAction,
      status
    } = req.body;

    if (title) {
      if (typeof title !== 'string' || title.length > 200) {
        return res.status(400).json({ message: 'Title must be <= 200 characters.' });
      }
      post.title = title;
    }
    if (content !== undefined) post.content = content;
    if (introduction !== undefined) post.introduction = introduction;
    if (mainBody !== undefined) post.mainBody = mainBody;
    if (conclusion !== undefined) post.conclusion = conclusion;
    if (callToAction !== undefined) post.callToAction = callToAction;
    if (status) post.status = status;

    // Ensure at least one body field
    if (!post.mainBody && !post.content) {
      return res.status(400).json({ message: 'Main Body (mainBody) or Content is required.' });
    }

    await post.save();
    await post.populate('author', 'name email');

    res.json({
      message: 'Post updated successfully',
      ...post.toObject()
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(400).json({ message: 'Failed to update post' });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if user owns the post or is admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }
    
    await Post.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Failed to delete post' });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const posts = await Post.find({ author: req.user._id })
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const totalPosts = await Post.countDocuments({ author: req.user._id });
    const totalPages = Math.ceil(totalPosts / limit);
    
    res.json({
      posts,
      currentPage: page,
      totalPages,
      totalPosts
    });
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({ message: 'Failed to fetch user posts' });
  }
};
