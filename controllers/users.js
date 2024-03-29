const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const { CONNECTION_STRING } = require('../utils/config');
const Sequelize = require('sequelize');
const { query } = require('express');
const sequelize = new Sequelize(CONNECTION_STRING, {
	dialect: 'postgres',
	dialectOptions: {
		ssl: {
			rejectUnauthorized: false,
		},
	},
});

usersRouter.post('/', async (req, res) => {
	const { username, email, password } = req.body;

	const saltRounds = 10;
	const passwordHash = await bcrypt.hash(password, saltRounds);

	let query = `
    INSERT INTO users (username, password, email)
    VALUES  ('${username}', '${passwordHash}', '${email}')
    `;

	sequelize
		.query(query)
		.then((dbRes) => {
			res.sendStatus(201);
		})
		.catch((err) => console.log(err));
});
module.exports = usersRouter;
