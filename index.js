const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const PORT = process.env.PORT || 3000;
require('dotenv').config();
const app = express();

app.use(express.json());
app.use('', routes);

const getDatabaseURI = () => {
	if (process.env.NODE_ENV === 'test') {
		return process.env.MONGODB_URI_DEV;
	}
	return process.env.MONGODB_URI_PROD;
};

const initializeDBandServer = () => {
	mongoose.set('strictQuery', true);
	mongoose
		.connect(getDatabaseURI())
		.then(() => {
			console.log('Database Connected');
			app.listen(PORT, () => {
				console.log('Server started');
			});
		})
		.catch((err) => {
			console.log('Database Not Connected Properly: ', err);
		});
};
initializeDBandServer();

module.exports = app;
