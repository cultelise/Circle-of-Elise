require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const { PORT } = require('../utils/config');
console.log(PORT);

app.use(cors());
app.use(express.json());

const { seed, signUp, test } = require('./controller');

app.get('/', (req, res) => {
	res.status(200).send(`<h1>Hi</h1>`);
});
app.get('/test', test);
app.post('/seed', seed);
app.post('/initiation', signUp);

app.listen(PORT, () => console.log(`listening on ${PORT}`));
