const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/users');
const { Post } = require('./models/posts');
require('dotenv').config();

const getDatabaseURI = () => {
	if (process.env.NODE_ENV === 'test') {
		return process.env.MONGODB_URI_DEV;
	}
	return process.env.MONGODB_URI_PROD;
};
const seedDB = async () => {
	const password = await bcrypt.hash(process.env.TEST_USERPASSWORD, 10);
	const users = [
		{ username: process.env.TEST_USERNAME, password: password },
		{ username: process.env.TEST_USERNAME2, password: password }
	];
	await User.deleteMany({});
	await Post.deleteMany({});
	await User.insertMany(users);
};

mongoose.set('strictQuery', true);
mongoose
	.connect(getDatabaseURI())
	.then(() => {
		console.log('Database Connected');
		seedDB().then(() => {
			mongoose.connection.close();
		});
	})
	.catch((err) => {
		console.log('Database Not Connected Properly: ', err);
	});
