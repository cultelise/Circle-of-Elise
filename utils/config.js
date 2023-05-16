require('dotenv').config();

const { PORT } = process.env;
const { CONNECTION_STRING } = process.env;

module.exports = {
	PORT,
	CONNECTION_STRING,
};
