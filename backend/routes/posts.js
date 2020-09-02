const express = require('express');

const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');

const postsController = require('../controllers/posts');

const router = express.Router();

// # Create single post
router.post('', checkAuth, extractFile, postsController.createPost);

// # Update single post
router.put('/:id',checkAuth, extractFile, postsController.updatePost);

// # Get all posts
router.get('', postsController.getPosts);

// # Get single post
router.get('/:id', postsController.getSinglePost);

// # Delete single post
router.delete('/:id', checkAuth, postsController.deleteSinglePost);

module.exports = router;
