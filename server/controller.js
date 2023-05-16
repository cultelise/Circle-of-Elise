const { CONNECTION_STRING } = require('../utils/config');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(CONNECTION_STRING, {
	dialect: 'postgres',
	dialectOptions: {
		ssl: {
			rejectUnauthorized: false,
		},
	},
});

module.exports = {
	seed: (req, res) => {
		const query = `
		CREATE TABLE posts (
			id SERIAL PRIMARY KEY,
			title VARCHAR(30),
			date CURRENT_DATE,
			time CURRENT_TIMESTAMP,
			content TEXT
		);
		
		CREATE TABLE tags (
			id SERIAL PRIMARY KEY,
			name VARCHAR(20)
		);
		
		CREATE TABLE post_tags (
			id SERIAL PRIMARY KEY,
			posts_id INT REFERENCES posts(id),
			tags_id INT REFERENCES tags(id)
		);		
		
		INSERT INTO posts (title, content)
		VALUES  ('test post', 'This is a test post. blah blah blah blah blah blah blah');
		
		INSERT INTO tags (name)
		VALUES	('test');
		`;
		sequelize
			.query(query)
			.then((dbRes) => res.status(200).send(dbRes[0]))
			.catch((err) => console.log(err));
	},
	signUp: (req, res) => {
		console.log(req.body);
		res.status(200).send(req.body);
	},
	createPost: (req, res) => {
		let { title, tags, content } = req.body;
		let query1 = `
		INSERT INTO posts (title, content)
		VALUES	('${title}', '${content}')
		`;
		tags.forEach((tag) => {
			let tagQuery1 = `
			SELECT FROM tags
			WHERE name = '${tag}'
			`;
			sequelize(tagQuery1).then((dbRes) => console.log(dbRes[0]));
		});
	},
	test: (req, res) => {
		let postId;
		let tagId;
		let query1 = `
		SELECT id FROM posts
		WHERE title = 'test post'
		`;
		sequelize
			.query(query1)
			.then((dbRes) => {
				console.log(typeof dbRes[0][0].id);
				postId = dbRes[0][0].id;
				console.log('POSTID:', postId);
				let query2 = `
				SELECT id FROM tags
				WHERE name = 'test'
				`;
				sequelize
					.query(query2)
					.then((dbRes) => {
						tagId = dbRes[0][0].id;
						console.log('ID"S HERE', tagId, postId);
						let query3 = `
				INSERT INTO post_tags (posts_id, tags_id)
				VALUES (${postId}, ${tagId})
				`;
						sequelize
							.query(query3)
							.then((dbRes) => res.status(200).send(dbRes[0]));
					})
					.catch((err) => console.log(err));
			})
			.catch((err) => console.log(err));
	},
};
