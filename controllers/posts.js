const jwt = require('jsonwebtoken');
const { CONNECTION_STRING, SECRET } = require('../utils/config');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(CONNECTION_STRING, {
	dialect: 'postgres',
	dialectOptions: {
		ssl: {
			rejectUnauthorized: false,
		},
	},
});

const getTokenFrom = (req) => {
	const authorization = req.get('authorization');
	console.log('Authorization:', authorization);
	if (authorization && authorization.startsWith('Bearer ')) {
		return authorization.replace('Bearer ', '');
	}
	return null;
};

module.exports = {
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

	createPost: (req, res) => {
		let { title, preview, tags, content } = req.body;

		console.log(SECRET);
		const decodedToken = jwt.verify(getTokenFrom(req), SECRET);
		if (!decodedToken.id) {
			return response.status(401).json({ error: 'token invalid' });
		}

		sequelize
			.query(
				`
    SELECT * FROM users
    WHERE id = ${decodedToken.id}`
			)
			.then((dbRes) => {
				console.log(dbRes[0][0].username);
				let username = dbRes[0][0].username;
				let query1 = `
		INSERT INTO posts (title, author, preview, content)
		VALUES	('${title}', '${username}', '${preview}', '${content}');

		SELECT * FROM posts
		WHERE	title = '${title}';
		`;
				sequelize.query(query1).then((dbRes) => res.status(201).send(dbRes[0]));
			})
			.catch((err) => console.log(err));

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
