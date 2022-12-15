const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../index');
const expect = chai.expect;
const constant = require('../constants');
const User = require('../models/users');

describe('Authenticating User', () => {
	it('With valid username, password', (done) => {
		chai.request(server)
			.post('/api/authenticate')
			.send({ username: process.env.TEST_USERNAME, password: process.env.TEST_USERPASSWORD })
			.end((error, response) => {
				expect(response.status).to.equal(200);
				expect(response.body).to.be.an('object');
				expect(response.body).to.have.a.property('token');
				done();
			});
	});

	it('With valid username and invalid password', (done) => {
		chai.request(server)
			.post('/api/authenticate')
			.send({ username: process.env.TEST_USERNAME, password: '123' })
			.end((error, response) => {
				expect(response.status).to.equal(401);
				expect(response.body).to.have.a.property('message');
				expect(response.body.message).to.equal(constant.AUTHENTICATION_FAILED_MESSAGE);
				done();
			});
	});

	it('With invalid username', (done) => {
		chai.request(server)
			.post('/api/authenticate')
			.send({ username: 'temp', password: '123' })
			.end((error, response) => {
				expect(response.status).to.equal(401);
				expect(response.body).to.have.a.property('message');
				expect(response.body.message).to.equal(constant.AUTHENTICATION_FAILED_MESSAGE);
				done();
			});
	});
});

describe('Get User Details', async () => {
	it('User Data', (done) => {
		chai.request(server)
			.post('/api/authenticate')
			.send({ username: process.env.TEST_USERNAME, password: process.env.TEST_USERPASSWORD })
			.end((error, response) => {
				expect(response.status).to.equal(200);
				expect(response.body).to.be.an('object');
				expect(response.body).to.have.a.property('token');
				const token = response.body.token;
				chai.request(server)
					.get('/api/user')
					.set('authorization', `Bearer ${token}`)
					.end((error, response) => {
						expect(response.status).to.equal(200);
						expect(response.body).to.be.an('object');
						expect(response.body).to.have.a.property('username');
						expect(response.body).to.have.a.property('followers');
						expect(response.body).to.have.a.property('following');
						done();
					});
			});
	});
});

describe('Followers', async () => {
	it('Follow User with valid id', (done) => {
		chai.request(server)
			.post('/api/authenticate')
			.send({ username: process.env.TEST_USERNAME, password: process.env.TEST_USERPASSWORD })
			.end((error, response) => {
				expect(response.status).to.equal(200);
				expect(response.body).to.be.an('object');
				expect(response.body).to.have.a.property('token');
				const token = response.body.token;
				User.findOne({ username: process.env.TEST_USERNAME2 }).then((res) => {
					chai.request(server)
						.post(`/api/follow/${res._id}`)
						.set('authorization', `Bearer ${token}`)
						.end((error, response) => {
							expect(response.status).to.equal(200);
							expect(response.body).to.be.an('object');
							expect(response.body).to.have.a.property('message');
							expect(response.body.message).to.equal(constant.USER_FOLLOWED_MESSAGE);
							done();
						});
				});
			});
	});

	it('Follow User with invalid id', (done) => {
		chai.request(server)
			.post('/api/authenticate')
			.send({ username: process.env.TEST_USERNAME, password: process.env.TEST_USERPASSWORD })
			.end((error, response) => {
				expect(response.status).to.equal(200);
				expect(response.body).to.be.an('object');
				expect(response.body).to.have.a.property('token');
				const token = response.body.token;
				chai.request(server)
					.post('/api/follow/123456')
					.set('authorization', `Bearer ${token}`)
					.end((error, response) => {
						expect(response.status).to.equal(404);
						expect(response.body).to.be.an('object');
						expect(response.body).to.have.a.property('message');
						expect(response.body.message).to.equal(constant.INVALID_ID);
						done();
					});
			});
	});

	it('Unfollow User with valid id', (done) => {
		chai.request(server)
			.post('/api/authenticate')
			.send({ username: process.env.TEST_USERNAME, password: process.env.TEST_USERPASSWORD })
			.end((error, response) => {
				expect(response.status).to.equal(200);
				expect(response.body).to.be.an('object');
				expect(response.body).to.have.a.property('token');
				const token = response.body.token;
				User.findOne({ username: process.env.TEST_USERNAME2 }).then((res) => {
					chai.request(server)
						.post(`/api/unfollow/${res._id}`)
						.set('authorization', `Bearer ${token}`)
						.end((error, response) => {
							expect(response.status).to.equal(200);
							expect(response.body).to.be.an('object');
							expect(response.body).to.have.a.property('message');
							expect(response.body.message).to.equal(constant.USER_UNFOLLOWED_MESSAGE);
							done();
						});
				});
			});
	});

	it('Unfollow User with invalid id', (done) => {
		chai.request(server)
			.post('/api/authenticate')
			.send({ username: process.env.TEST_USERNAME, password: process.env.TEST_USERPASSWORD })
			.end((error, response) => {
				expect(response.status).to.equal(200);
				expect(response.body).to.be.an('object');
				expect(response.body).to.have.a.property('token');
				const token = response.body.token;
				chai.request(server)
					.post('/api/unfollow/123456')
					.set('authorization', `Bearer ${token}`)
					.end((error, response) => {
						expect(response.status).to.equal(404);
						expect(response.body).to.be.an('object');
						expect(response.body).to.have.a.property('message');
						expect(response.body.message).to.equal(constant.INVALID_ID);
						done();
					});
			});
	});
});
