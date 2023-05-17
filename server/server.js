require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const { PORT } = require('../utils/config');
console.log(PORT);

app.use(cors());
app.use(express.json());

const {
	seed,
	getPosts,
	getPost,
	signUp,
	createPost,
	test,
} = require('./controller');

app.get('/display', (req, res) => {
	res
		.status(200)
		.sendFile('/Users/elise/Cult/personal-blog/pages/display.html');
});

app.get('/posts', getPosts);
app.get('/post/:id', getPost);
app.get('/test', test);

app.post('/seed', seed);

app.post('/initiation', signUp);

app.post('/post', createPost);

app.listen(PORT, () => console.log(`listening on ${PORT}`));
