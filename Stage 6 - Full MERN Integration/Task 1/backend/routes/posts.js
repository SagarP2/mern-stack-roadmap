import express from 'express';
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getUserPosts
} from '../controllers/postController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getPosts)
  .post(protect, createPost);

router.get('/my-posts', protect, getUserPosts);

router.route('/:id')
  .get(getPost)
  .put(protect, updatePost)
  .delete(protect, deletePost);

export default router;
