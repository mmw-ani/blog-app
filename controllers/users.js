const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const constants = require('../constants');
const User = require('../models/users');

const authenticate = async (request, response) => {
	try {
		const { username, password } = request.body;
		const user = await User.findOne({ username: username });
		if (!user) {
			return response.status(401).json({ message: constants.AUTHENTICATION_FAILED_MESSAGE });
		}
		const passwordMatched = await bcrypt.compare(password, user.password);
		if (!passwordMatched) {
			return response.status(401).json({ message: constants.AUTHENTICATION_FAILED_MESSAGE });
		}

		const payload = { id: user._id, username: user.username };
		const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });

		return response.json({ token });
	} catch (error) {
		console.log(error);
		return response.status(500).json({ message: constants.SERVER_ERROR_MESSAGE });
	}
};

const userDetails = async (request, response) => {
	try {
		const userId = request.user?.id;
		const user = await User.findOne({ _id: userId });
		if (!user) {
			return response.status(404).json({ message: constants.USER_NOT_FOUND });
		}
		const userDetails = { username: user.username, followers: user.followers.length, following: user.following.length };
		return response.json(userDetails);
	} catch (err) {
		console.log(err);
		return response.status(501).json({ message: constants.SERVER_ERROR_MESSAGE });
	}
};

const followUser = async (request, response) => {
	try {
		const userId = request.user.id;
		const user = await User.findOne({ _id: userId });
		const toFollowId = request.params.id;
		const toFollowUser = await User.findOne({ _id: toFollowId });
		if (!toFollowUser || !user) {
			return response.status(404).json({ message: constants.USER_NOT_FOUND });
		}
		await User.findOneAndUpdate(
			{ _id: userId },
			{
				$addToSet: {
					following: toFollowId
				}
			}
		);
		await User.findOneAndUpdate(
			{ _id: toFollowId },
			{
				$addToSet: {
					followers: userId
				}
			}
		);
		return response.json({ message: constants.USER_FOLLOWED_MESSAGE });
	} catch (err) {
		console.log(err);
		return response.status(501).json({ message: constants.SERVER_ERROR_MESSAGE });
	}
};
const unfollowUser = async (request, response) => {
	try {
		const userId = request.user.id;
		const user = await User.findOne({ _id: userId });
		const toUnfollowId = request.params.id;
		const toUnfollowUser = await User.findOne({ _id: toUnfollowId });
		if (!toUnfollowUser || !user) {
			return response.status(404).json({ message: constants.USER_NOT_FOUND });
		}
		await User.findOneAndUpdate(
			{ _id: userId },
			{
				$pull: {
					following: toUnfollowId
				}
			}
		);
		await User.findOneAndUpdate(
			{ _id: toUnfollowId },
			{
				$pull: {
					followers: userId
				}
			}
		);
		return response.json({ message: constants.USER_UNFOLLOWED_MESSAGE });
	} catch (err) {
		console.log(err);
		return response.status(501).json({ message: constants.SERVER_ERROR_MESSAGE });
	}
};

module.exports = { authenticate, userDetails, followUser, unfollowUser };
