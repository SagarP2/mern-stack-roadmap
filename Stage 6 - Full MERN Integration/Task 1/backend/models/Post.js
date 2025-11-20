import mongoose from 'mongoose';


const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  // Old content field for backward compatibility
  content: {
    type: String,
    minlength: [10, 'Content must be at least 10 characters'],
  },
  // New structured fields
  introduction: {
    type: String,
    default: '',
  },
  mainBody: {
    type: String,
    required: false, // validated in controller
    default: '',
  },
  conclusion: {
    type: String,
    default: '',
  },
  callToAction: {
    type: String,
    default: '',
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'published'
  },
  views: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Index for better query performance
postSchema.index({ title: 'text', content: 'text' });
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ status: 1, createdAt: -1 });

const Post = mongoose.model('Post', postSchema);

export default Post;
