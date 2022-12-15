const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentModel = Schema({
	comment: String,
	date: { type: Date, default: Date.now },
	created_by: { type: Schema.Types.ObjectId, ref: 'User' }
});

const postModel = Schema({
	title: { type: String, required: true },
	description: String,
	likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
	created_by: String,
	created_at: { type: Date, default: Date.now }
});

const Comment = mongoose.model('Comment', commentModel);
const Post = mongoose.model('Post', postModel);

module.exports = { Post, Comment };
