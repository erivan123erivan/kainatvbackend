// src/routes/post.ts
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
// Ensure that these methods exist in postController
router.get('/all', postController.getPosts);
router.get('/last', postController.getPostsLast);
router.get('/:id', postController.getPostByID); // Note: Use :id for dynamic ID
router.post('/:id/like', postController.incrementLike); // Added parameter for post ID
module.exports = router;
