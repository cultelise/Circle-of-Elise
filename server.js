require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

const { PORT } = require('./utils/config');
console.log(PORT);

app.use(cors());
app.use(express.json());
app.use('/users', usersRouter);
app.use('/login', loginRouter);

const { seed } = require('./controllers/seed');
const {
	getPosts,
	getPost,
	signUp,
	createPost,
	test,
} = require('./controllers/posts');

app.get('/display', (req, res) => {
	res
		.status(200)
		.sendFile('/Users/elise/Cult/personal-blog/pages/display.html');
});

app.get('/posts', getPosts);
app.get('/post/:id', getPost);
app.get('/test', test);

app.post('/seed', seed);

app.post('/post', createPost);

app.listen(PORT, () => console.log(`listening on ${PORT}`));
