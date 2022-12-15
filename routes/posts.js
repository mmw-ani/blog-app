const express = require('express');
const router = express.Router();
const postController = require('../controllers/posts');
const { authenticateUser, validateId } = require('../middleware');

router
	.post('/posts', authenticateUser, postController.createPost)
	.delete('/posts/:id', authenticateUser, validateId, postController.deletePost)
	.post('/like/:id', authenticateUser, validateId, postController.likeAPost)
	.post('/unlike/:id', authenticateUser, validateId, postController.unlikeAPost)
	.get('/posts/:id', authenticateUser, validateId, postController.getPostDetails)
	.get('/all_posts', authenticateUser, postController.getPostForAUser)
	.post('/comment/:id', authenticateUser, validateId, postController.commentOnPost);

module.exports = router;
