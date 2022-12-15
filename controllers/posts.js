const { Post, Comment } = require('../models/posts');
const User = require('../models/users');
const constants = require('../constants');

const createPost = async (request, response) => {
	try {
		const userId = request.user.id;
		const { title, description } = request.body;
		if (!title) {
			return response.status(400).json({ message: constants.TITLE_REQUIRED_FOR_POST });
		}
		const post = {
			title: title,
			description: description,
			created_by: userId
		};
		const newPost = await Post.create(post);

		const modifiedResponse = { id: newPost._id, title: newPost.title, description: newPost.description, created_at: newPost.created_at };

		return response.send(modifiedResponse);
	} catch (err) {
		console.log(err);
		return response.status(501).json({ message: constants.SERVER_ERROR_MESSAGE });
	}
};

const deletePost = async (request, response) => {
	try {
		const userId = request.user.id;
		const postId = request.params.id;

		await Post.deleteOne({ _id: postId, created_by: userId });
		return response.json({ message: 'Post Deleted' });
	} catch (err) {
		console.log(err);
		return response.status(501).json({ message: constants.SERVER_ERROR_MESSAGE });
	}
};

const likeAPost = async (request, response) => {
	try {
		const userId = request.user.id;
		const postId = request.params.id;
		await Post.findOneAndUpdate(
			{ _id: postId },
			{
				$addToSet: {
					likes: userId
				}
			}
		);
		return response.json({ message: constants.LIKED_POST_MESSAGE });
	} catch (err) {
		console.log(err);
		return response.status(501).json({ message: constants.SERVER_ERROR_MESSAGE });
	}
};

const unlikeAPost = async (request, response) => {
	try {
		const userId = request.user.id;
		const postId = request.params.id;
		await Post.findOneAndUpdate(
			{ _id: postId },
			{
				$pull: {
					likes: userId
				}
			}
		);
		return response.json({ message: constants.UNLIKED_POST_MESSAGE });
	} catch (err) {
		console.log(err);
		return response.status(501).json({ message: constants.SERVER_ERROR_MESSAGE });
	}
};

const getPostDetails = async (request, response) => {
	try {
		const postId = request.params.id;
		const post = await Post.findOne({ _id: postId }).populate('comments');
		const modifiedPostResponse = refactorPostSchema(post);
		return response.send(modifiedPostResponse);
	} catch (err) {
		console.log(err);
		return response.status(501).json({ message: constants.SERVER_ERROR_MESSAGE });
	}
};

const getPostForAUser = async (request, response) => {
	try {
		const userId = request.user.id;
		const user = await User.findOne({ _id: userId });
		if (!user) {
			return response.status(404).json({ message: constants.USER_NOT_FOUND });
		}
		const posts = await Post.find({ created_by: userId }).populate('comments').sort({ created_at: -1 });
		const modifiedPostResponse = [];
		for (const post of posts) {
			const modifiedPostDetails = refactorPostSchema(post);
			modifiedPostResponse.push(modifiedPostDetails);
		}
		return response.send(modifiedPostResponse);
	} catch (err) {
		console.log(err);
		return response.status(501).json({ message: constants.SERVER_ERROR_MESSAGE });
	}
};

const commentOnPost = async (request, response) => {
	try {
		const postId = request.params.id;
		const userId = request.user.id;
		const { comment } = request.body;
		const user = await User.findOne({ _id: userId });
		if (!user) {
			return response.status(404).json({ message: constants.USER_NOT_FOUND });
		}
		const createdComment = await Comment.create({ comment: comment, created_by: userId });

		await Post.findOneAndUpdate(
			{ _id: postId },
			{
				$push: {
					comments: createdComment._id
				}
			}
		);
		return response.json({ id: createdComment._id });
	} catch (err) {
		console.log(err);
		return response.status(501).json({ message: constants.SERVER_ERROR_MESSAGE });
	}
};

const refactorPostSchema = (post) => {
	const modifiedPostResponse = {
		id: post._id,
		title: post.title,
		description: post.description,
		likes: post.likes.length,
		created_at: post.created_at,
		comments: []
	};
	for (const comment of post.comments) {
		const modifiedComment = { id: comment._id, comment: comment.comment, date: comment.date };
		modifiedPostResponse.comments.push(modifiedComment);
	}
	return modifiedPostResponse;
};

module.exports = { createPost, deletePost, likeAPost, unlikeAPost, getPostDetails, getPostForAUser, commentOnPost };
