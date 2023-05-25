const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
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

loginRouter.post('/', async (req, res) => {
	const { username, password } = req.body;

	let query = `
    SELECT * FROM users
    WHERE username = '${username}'
    `;

	sequelize
		.query(query)
		.then(async (dbRes) => {
			let [user] = dbRes[0];

			if (!user) {
				return res.status(401).json({ error: 'invalid username' });
			}

			const passCorrect =
				user === null ? false : await bcrypt.compare(password, user.password);

			if (!(user && passCorrect)) {
				return res.status(401).json({ error: 'invalid username or password' });
			}
			const userForToken = {
				username: user.username,
				id: user.id,
			};

			const token = jwt.sign(userForToken, SECRET);
			res.status(200).send({ token, username: user.username });
		})
		.catch((err) => console.log(err));
});

module.exports = loginRouter;
