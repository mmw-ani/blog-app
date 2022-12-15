const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../index');
const expect = chai.expect;
const constant = require('../constants');

describe('Post Details', () => {
	it('Creating Post with valid parameters', (done) => {
		chai.request(server)
			.post('/api/authenticate')
			.send({ username: process.env.TEST_USERNAME, password: process.env.TEST_USERPASSWORD })
			.end((error, response) => {
				expect(response.status).to.equal(200);
				expect(response.body).to.be.an('object');
				expect(response.body).to.have.a.property('token');
				const token = response.body.token;
				chai.request(server)
					.post('/api/posts')
					.send({ title: 'Post 1', description: 'Post Description' })
					.set('authorization', `Bearer ${token}`)
					.end((err, res) => {
						expect(res.status).to.equal(200);
						expect(res.body).to.be.an('object');
						expect(res.body).to.have.a.property('id');
						expect(res.body).to.have.a.property('title');
						expect(res.body).to.have.a.property('description');
						done();
					});
			});
	});

	it('Creating Post with no title', (done) => {
		chai.request(server)
			.post('/api/authenticate')
			.send({ username: process.env.TEST_USERNAME, password: process.env.TEST_USERPASSWORD })
			.end((error, response) => {
				expect(response.status).to.equal(200);
				expect(response.body).to.be.an('object');
				expect(response.body).to.have.a.property('token');
				const token = response.body.token;
				chai.request(server)
					.post('/api/posts')
					.send({ description: 'Post Description' })
					.set('authorization', `Bearer ${token}`)
					.end((err, res) => {
						expect(res.status).to.equal(400);
						expect(res.body).to.be.an('object');
						expect(res.body).to.have.a.property('message');
						expect(res.body.message).to.equal(constant.TITLE_REQUIRED_FOR_POST);
						done();
					});
			});
	});

	it('Get Post Details', (done) => {
		// Login User
		chai.request(server)
			.post('/api/authenticate')
			.send({ username: process.env.TEST_USERNAME, password: process.env.TEST_USERPASSWORD })
			.end((error, response) => {
				expect(response.status).to.equal(200);
				expect(response.body).to.be.an('object');
				expect(response.body).to.have.a.property('token');
				const token = response.body.token;

				// Creating post

				chai.request(server)
					.post('/api/posts')
					.send({ title: 'Test', description: 'Post Description' })
					.set('authorization', `Bearer ${token}`)
					.end((err, res) => {
						expect(res.status).to.equal(200);
						expect(res.body).to.be.an('object');

						// Get post details

						chai.request(server)
							.get(`/api/posts/${res.body.id}`)
							.set('authorization', `Bearer ${token}`)
							.end((err, postResponse) => {
								expect(postResponse.status).to.equal(200);
								expect(postResponse.body).to.be.an('object');
								expect(postResponse.body).to.have.a.property('id');
								expect(postResponse.body).to.have.a.property('title');
								expect(postResponse.body).to.have.a.property('description');
								expect(postResponse.body).to.have.a.property('likes');
								expect(postResponse.body).to.have.a.property('comments');
								done();
							});
					});
			});
	});

	it('Get All Post For a User', (done) => {
		// Login User
		chai.request(server)
			.post('/api/authenticate')
			.send({ username: process.env.TEST_USERNAME, password: process.env.TEST_USERPASSWORD })
			.end((error, response) => {
				expect(response.status).to.equal(200);
				expect(response.body).to.be.an('object');
				expect(response.body).to.have.a.property('token');
				const token = response.body.token;

				// Get post details

				chai.request(server)
					.get(`/api/all_posts`)
					.set('authorization', `Bearer ${token}`)
					.end((err, postResponse) => {
						expect(postResponse.status).to.equal(200);
						expect(postResponse.body).to.be.an('array');
						done();
					});
			});
	});
});

describe('Post Deletion', () => {
	it('Deleting Post', (done) => {
		chai.request(server)
			.post('/api/authenticate')
			.send({ username: process.env.TEST_USERNAME, password: process.env.TEST_USERPASSWORD })
			.end((error, response) => {
				expect(response.status).to.equal(200);
				expect(response.body).to.be.an('object');
				expect(response.body).to.have.a.property('token');
				const token = response.body.token;
				chai.request(server)
					.post('/api/posts')
					.send({ title: 'Post 1', description: 'Post Description' })
					.set('authorization', `Bearer ${token}`)
					.end((err, res) => {
						expect(res.status).to.equal(200);
						expect(res.body).to.be.an('object');
						expect(res.body).to.have.a.property('id');
						expect(res.body).to.have.a.property('title');
						expect(res.body).to.have.a.property('description');
						chai.request(server)
							.delete(`/api/posts/${res.body.id}`)
							.set('authorization', `Bearer ${token}`)
							.end((err, deleteResponse) => {
								expect(deleteResponse.status).to.equal(200);
								expect(deleteResponse.body).to.be.an('object');
								expect(deleteResponse.body.message).to.equal('Post Deleted');
								done();
							});
					});
			});
	});
});

describe('Like + Unlike + Comment', () => {
	it('Like + Unlike the post', (done) => {
		// Login User
		chai.request(server)
			.post('/api/authenticate')
			.send({ username: process.env.TEST_USERNAME, password: process.env.TEST_USERPASSWORD })
			.end((error, response) => {
				expect(response.status).to.equal(200);
				expect(response.body).to.be.an('object');
				expect(response.body).to.have.a.property('token');
				const token = response.body.token;

				// Creating post

				chai.request(server)
					.post('/api/posts')
					.send({ title: 'Test', description: 'Post Description' })
					.set('authorization', `Bearer ${token}`)
					.end((err, res) => {
						expect(res.status).to.equal(200);
						expect(res.body).to.be.an('object');

						// Like the post

						chai.request(server)
							.post(`/api/like/${res.body.id}`)
							.set('authorization', `Bearer ${token}`)
							.end((err, likeResponse) => {
								expect(likeResponse.status).to.equal(200);
								expect(likeResponse.body).to.be.an('object');
								expect(likeResponse.body).to.have.a.property('message');
								expect(likeResponse.body.message).to.equal(constant.LIKED_POST_MESSAGE);

								// Unlike the post
								chai.request(server)
									.post(`/api/unlike/${res.body.id}`)
									.set('authorization', `Bearer ${token}`)
									.end((err, unlikeRes) => {
										expect(unlikeRes.status).to.equal(200);
										expect(unlikeRes.body).to.be.an('object');
										expect(unlikeRes.body).to.have.a.property('message');
										expect(unlikeRes.body.message).to.equal(constant.UNLIKED_POST_MESSAGE);
										done();
									});
							});
					});
			});
	});

	it('Comment on the post', (done) => {
		// Login User
		chai.request(server)
			.post('/api/authenticate')
			.send({ username: process.env.TEST_USERNAME, password: process.env.TEST_USERPASSWORD })
			.end((error, response) => {
				expect(response.status).to.equal(200);
				expect(response.body).to.be.an('object');
				expect(response.body).to.have.a.property('token');
				const token = response.body.token;

				// Creating post

				chai.request(server)
					.post('/api/posts')
					.send({ title: 'Test', description: 'Post Description' })
					.set('authorization', `Bearer ${token}`)
					.end((err, res) => {
						expect(res.status).to.equal(200);
						expect(res.body).to.be.an('object');

						// Commenting on the post

						chai.request(server)
							.post(`/api/comment/${res.body.id}`)
							.set('authorization', `Bearer ${token}`)
							.end((err, commentResponse) => {
								expect(commentResponse.status).to.equal(200);
								expect(commentResponse.body).to.be.an('object');
								expect(commentResponse.body).to.have.a.property('id');
								done();
							});
					});
			});
	});
});
