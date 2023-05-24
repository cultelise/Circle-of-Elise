require('dotenv').config();

const { PORT } = process.env;
const { CONNECTION_STRING } = process.env;
const { SECRET } = process.env;

module.exports = {
	PORT,
	CONNECTION_STRING,
	SECRET,
};
