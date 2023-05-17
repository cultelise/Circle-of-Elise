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

		DROP TABLE if exists post_tags;
		DROP TABLE if exists posts;
		DROP TABLE if exists tags;

		CREATE TABLE posts (
			id SERIAL PRIMARY KEY,
			title VARCHAR(30),
			date DATE default CURRENT_DATE,
			time TIMESTAMP default CURRENT_TIMESTAMP,
			preview TEXT,
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
		
		INSERT INTO posts (title, preview, content)
		VALUES  ('test post', 'preview', 'This is a test post. blah blah blah blah blah blah blah');
		
		INSERT INTO tags (name)
		VALUES	('test');
		`;
		sequelize
			.query(query)
			.then((dbRes) => res.status(200).send(dbRes[0]))
			.catch((err) => console.log(err));
	},

	getPosts: (req, res) => {
		let query = `
		SELECT * FROM posts
		`;
		sequelize
			.query(query)
			.then((dbRes) => res.status(200).send(dbRes[0]))
			.catch((err) => console.log(err));
	},

	getPost: (req, res) => {
		let { id } = req.params;
		let query = `
		SELECT * FROM posts
		WHERE id = ${id}
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
		let { title, preview, tags, content } = req.body;
		let query1 = `
		INSERT INTO posts (title, preview, content)
		VALUES	('${title}', '${preview}', '${content}')
		`;
		sequelize.query(query1).then((dbRes) => res.status(200).send(dbRes[0]));
		// tags.forEach((tag) => {
		// 	let tagQuery1 = `
		// 	SELECT FROM tags
		// 	WHERE name = '${tag}'
		// 	`;
		// 	sequelize(tagQuery1).then((dbRes) => console.log(dbRes[0]));
		// });
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
