const jwt = require('jsonwebtoken');
const constants = require('./constants');
const mongoose = require('mongoose');

const authenticateUser = (request, response, next) => {
	let token = request.headers.authorization;
	if (!token) {
		return response.status(401).json({ message: constants.UNAUTHORIZED_USER_MESSAGE });
	}

	token = token.split(' ');
	if (token.length != 2 || !token[1]) {
		return response.status(401).json({ message: constants.UNAUTHORIZED_USER_MESSAGE });
	}
	token = token[1];
	jwt.verify(token, process.env.JWT_SECRET_KEY, (error, payload) => {
		if (error) {
			return response.status(401).json({ message: constants.UNAUTHORIZED_USER_MESSAGE });
		}
		request.user = payload;
		next();
	});
};

const validateId = (request, response, next) => {
	if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
		return response.status(404).json({ message: constants.INVALID_ID });
	}
	next();
};

module.exports = { authenticateUser, validateId };
