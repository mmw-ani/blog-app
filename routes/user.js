const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const { authenticateUser, validateId } = require('../middleware');

router
	.post('/authenticate', usersController.authenticate)
	.get('/user', authenticateUser, usersController.userDetails)
	.post('/follow/:id', authenticateUser, validateId, usersController.followUser)
	.post('/unfollow/:id', authenticateUser, validateId, usersController.unfollowUser);

module.exports = router;
