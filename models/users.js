const mongoose = require('mongoose');
const { Schema } = mongoose;
const userModel = Schema({
	username: { type: String, unique: true },
	password: String,
	followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	following: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('User', userModel);
