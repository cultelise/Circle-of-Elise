require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const { getComments, postComment } = require('./controllers/comments');

const { PORT } = require('./utils/config');

app.use(cors());
app.use(express.json());
app.use('/users', usersRouter);
app.use('/login', loginRouter);

const { seed } = require('./controllers/seed');
const { getPosts, getPost, createPost, test } = require('./controllers/posts');

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

app.get('/comments/:id', getComments);
app.post('/comments/:id', postComment);

app.listen(PORT, () => console.log(`listening on ${PORT}`));
