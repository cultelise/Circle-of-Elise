const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { SECRET } = process.env;
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

const getTokenFrom = (req) => {
	const authorization = req.get('authorization');
	console.log('Authorization:', authorization);
	if (authorization && authorization.startsWith('Bearer ')) {
		return authorization.replace('Bearer ', '');
	}
	return null;
};

module.exports = {
	getComments: (req, res) => {
		console.log(req.body);
		const postId = req.params.id;
		console.log('get params', req.params);
		let query = `
    SELECT c.id, c.content, c.date, c.time, p.id, p.title, u.username
    FROM posts p
    JOIN post_comments pc ON p.id = pc.posts_id
    JOIN comments c ON pc.comments_id = c.id
    JOIN user_comments uc ON c.id = uc.comments_id
    JOIN users u ON u.id = uc.users_id
    WHERE p.id = ${postId}
    `;
		sequelize
			.query(query)
			.then((dbRes) => {
				console.log(dbRes[0]);
				res.status(200).send(dbRes[0]);
			})
			.catch((err) => console.log(err));
	},

	postComment: async (req, res) => {
		console.log('body:', req.body);
		console.log('params:', req.params);
		const postId = req.params.id;
		const { content } = req.body;
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
				console.log('User Select:', dbRes[0]);
				let userId = dbRes[0][0].id;

				sequelize
					.query(
						`
      INSERT INTO comments (content)
      VALUES  ('${content}');

      SELECT * FROM comments
      WHERE content = '${content}';
      `
					)
					.then((dbRes) => {
						console.log('Comments insert:', dbRes[0]);
						let comment = dbRes[0][0];
						console.log('comment:', comment);

						sequelize
							.query(
								`
          INSERT INTO post_comments (posts_id, comments_id)
          VALUES  (${postId}, ${comment.id});

          INSERT INTO user_comments (comments_id, users_id)
          VALUES (${comment.id}, ${userId});
          `
							)
							.then((dbRes) => {
								console.log('Connector inserts:', dbRes[0]);
							})
							.catch((err) => console.log(err));
					})
					.catch((err) => {
						console.log(err);
					});
			})
			.catch((err) => console.log(err));
	},
};
