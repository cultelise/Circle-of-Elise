const mainMain = document.querySelector('#main-main');
const hideBox = document.getElementById('opaque-layer');
const initForm = document.getElementById('initiation-form');
const initName = document.getElementById('codename');
const contentBox = document.getElementById('post-text');
const contentButton = document.getElementById('content-button');
const contentTitle = document.getElementById('content-title');
const postPreview = document.getElementById('post-preview');
const loginForm = document.getElementById('login-form');
const displayPage = document.getElementById('display-page');
const baseUrl = 'http://localhost:3000';
const signupLink = document.getElementById('signup-link');
const loginLink = document.getElementById('login-link');
const logoutLink = document.getElementById('logout-link');
const postLink = document.getElementById('post-link');
const loginDisplay = document.getElementById('login-display');
const error = document.getElementsByClassName('error')[0];

if (localStorage.getItem('auth')) {
	logoutLink.style.display = 'block';
	postLink.style.display = 'block';
	signupLink.style.display = 'none';
	loginLink.style.display = 'none';
}

const getPosts = async () => {
	let response = await axios.get(`${baseUrl}/posts`);
	return response.data;
};

if (mainMain) {
	const createPostCards = async () => {
		for (let i = 1; i <= 4; i++) {
			let post = await getPosts();
			post = post[i - 1];
			if (post) {
				let card = document.createElement('div');
				card.id = `card-${i}`;
				card.classList.add('card');

				let button = document.createElement('button');
				button.id = `post-button-${i}`;
				button.classList.add('unselectable');
				button.classList.add('post-button');

				let openEye = document.createElement('img');
				openEye.setAttribute('src', '/static/eye-close.svg');
				openEye.classList.add('show');

				let closedEye = document.createElement('img');
				closedEye.setAttribute('src', '/static/eye-open.svg');
				closedEye.classList.add('hide');
				button.appendChild(openEye);
				button.appendChild(closedEye);

				let textDiv = document.createElement('div');
				let title = document.createElement('div');
				title.id = `post-title-${i}`;
				title.classList.add('title');

				let link = document.createElement('a');
				link.id = `post-link${i}`;
				link.textContent = post.title;

				let preview = document.createElement('div');
				preview.id = `preview-${i}`;
				preview.classList.add('preview', 'hide');
				preview.textContent = post.preview;

				button === null || button === void 0
					? void 0
					: button.addEventListener('click', (e) => {
							const target = e.target;
							let button;
							if (target.id.includes('button')) {
								button = e.target;
							}
							button.style.opacity = '0';
							card.style.opacity = '0';
							card.style.pointerEvents = 'none';
							button.style.fontSize = '30px';

							setTimeout(function () {
								if (closedEye.classList.contains('show')) {
									closedEye.classList.remove('show');
									closedEye.classList.add('hide');
									openEye.classList.remove('hide');
									openEye.classList.add('show');
									button.style.fontSize = '40px';
									button.style.opacity = '100';
									card.style.opacity = '100';
									preview.classList.remove('show');
									preview.classList.add('hide');
									title.style.borderBottom = '1px solid black';
								} else {
									closedEye.classList.remove('hide');
									closedEye.classList.add('show');
									openEye.classList.remove('show');
									openEye.classList.add('hide');
									button.style.fontSize = '40px';
									button.style.opacity = '100';
									card.style.opacity = '100';
									preview.classList.remove('hide');
									preview.classList.add('show');
									title.style.borderBottom = 'none';
								}
							}, 300);
							setTimeout(function () {
								card.style.pointerEvents = 'auto';
							}, 500);
					  });

				title === null || title === void 0
					? void 0
					: link.addEventListener('click', async (e) => {
							let id = e.target.id;
							let idNum = +id.charAt(id.length - 1);
							window.localStorage.setItem('post', `${idNum}`);
							window.location.href = '../pages/display.html';
					  });

				card.appendChild(button);
				title.appendChild(link);
				textDiv.appendChild(title);
				textDiv.appendChild(preview);
				card.appendChild(textDiv);
				mainMain.appendChild(card);
			}
		}
	};

	createPostCards();
}

if (displayPage) {
	const display = async () => {
		let id = +window.localStorage.getItem('post');
		let response = await axios.get(`${baseUrl}/post/${id}`);
		let post = response.data[0];

		let postDiv = document.createElement('div');
		postDiv.id = 'display-post';

		let titleDiv = document.createElement('div');
		titleDiv.style.fontSize = '40px';
		titleDiv.style.textDecoration = 'underline';
		let dateDiv = document.createElement('div');
		dateDiv.textContent = `${post.date}`;

		let authorDiv = document.createElement('div');
		authorDiv.textContent = `by ${post.author}`;
		authorDiv.style.fontSize = '20px';

		let contentDiv = document.createElement('div');
		contentDiv.style.margin = '40px 0px 75px 0px';

		let commentContainer = document.createElement('div');
		commentContainer.id = 'comments';

		let commentForm = document.createElement('form');
		commentForm.id = 'comment-form';

		let commentLabel = document.createElement('a');
		commentLabel.textContent = 'Create Comment';
		commentLabel.style.marginTop = '10px';
		commentLabel.style.fontWeight = 'bold';
		commentLabel.style.fontStyle = 'underline';

		let commentInput = document.createElement('textarea');
		commentInput.id = 'comment-input';
		commentInput.type = 'text';

		let commentButton = document.createElement('button');
		commentButton.textContent = 'Submit';
		commentButton.style.display = 'none';

		commentButton.addEventListener('click', (e) => {
			e.preventDefault();
			let token = window.localStorage.getItem('auth');
			if (token) {
				axios.post(
					`${baseUrl}/comments/${id}`,
					{ content: commentInput.value },
					{
						headers: {
							authorization: `Bearer ${token}`,
						},
					}
				);
			}
			setTimeout(() => {
				location.reload();
			}, 2000);
		});

		commentLabel.addEventListener('click', () => {
			commentInput.style.display = 'block';
			commentButton.style.display = 'block';
		});

		commentForm.appendChild(commentLabel);
		commentForm.appendChild(commentInput);
		commentForm.appendChild(commentButton);

		commentButton.addEventListener('submit', (e) => {
			e.preventDefault();
			let token = window.localStorage.getItem('auth');
			if (token) {
				axios.post(
					`${baseUrl}/comments/${id}`,
					{ content: commentInput.value },
					{
						headers: {
							authorization: `Bearer ${token}`,
						},
					}
				);
			}
			setTimeout(() => {
				location.reload();
			}, 2000);
		});
		const commentsLabel = document.createElement('div');
		commentsLabel.textContent = 'Comments';
		commentsLabel.style.fontWeight = 'bold';
		commentContainer.appendChild(commentsLabel);

		let res = await axios.get(`${baseUrl}/comments/${id}`);
		let comments = res.data;
		comments.forEach((comment, i) => {
			let commentDiv = document.createElement('div');

			let dateDiv = document.createElement('div');
			dateDiv.textContent = comment.date;
			dateDiv.style.textDecoration = 'underline';

			let usernameDiv = document.createElement('b');
			usernameDiv.textContent = comment.username;
			usernameDiv.style.fontSize = '20px';

			let commentContent = document.createElement('div');

			commentDiv.classList.add('comment');
			commentContent.textContent = comment.content;

			commentDiv.appendChild(dateDiv);
			commentDiv.appendChild(usernameDiv);
			commentDiv.appendChild(commentContent);
			commentContainer.appendChild(commentDiv);
		});
		commentContainer.appendChild(commentForm);

		let previewDiv = document.createElement('p');
		previewDiv.innerHTML = post.preview;
		previewDiv.style.fontStyle = 'italic';
		previewDiv.style.textDecoration = 'underline';

		titleDiv.textContent = post.title;
		contentDiv.innerHTML = post.content;

		postDiv.appendChild(dateDiv);
		postDiv.appendChild(titleDiv);
		postDiv.appendChild(authorDiv);
		postDiv.appendChild(previewDiv);
		postDiv.appendChild(contentDiv);
		postDiv.appendChild(commentContainer);
		displayPage.appendChild(postDiv);
	};
	if (localStorage.getItem('auth')) {
		display();
	} else {
		let loginDisplay = document.getElementById('login-display');
		loginDisplay.style.display = 'flex';
	}
}

initForm === null || initForm === void 0
	? void 0
	: initForm.addEventListener('submit', (event) => {
			event.preventDefault();
			axios.post(`${baseUrl}/users`, {
				email: initForm[0].value,
				username: initForm[1].value,
				password: initForm[2].value,
			});
			window.location.href = '../pages/login.html';
	  });

contentButton === null || contentButton === void 0
	? void 0
	: contentButton.addEventListener('click', (e) => {
			e.preventDefault();
			let token = window.localStorage.getItem('auth');
			axios
				.post(
					'http://localhost:3000/post',
					{
						title: contentTitle.value,
						content: contentBox.value,
						preview: postPreview.value,
					},
					{
						headers: {
							authorization: `Bearer ${token}`,
						},
					}
				)
				.then((response) => {
					if ((response.status = 200)) {
						error.style.display = 'block';
						error.textContent = 'post successful';
						setTimeout(() => {
							error.style.display = 'none';
							localStorage.setItem('post', response.data[0].id);
							window.location.href = '../pages/display.html';
						}, 2000);
					}
				})
				.catch((err) => {
					error.style.display = 'block';
					error.style.background = 'red';
					error.textContent = `post failed`;
					setTimeout(() => {
						error.style.display = 'none';
						window.location.reload();
					}, 3000);
				});
	  });
loginForm === null || loginForm === void 0
	? void 0
	: loginForm.addEventListener('submit', (e) => {
			e.preventDefault();
			let body = {
				username: loginForm[0].value,
				password: loginForm[1].value,
			};
			axios
				.post(`${baseUrl}/login`, body)
				.then((res) => {
					if ((res.status = 200)) {
						error.style.display = 'block';
						error.textContent = 'entry successful';
						setTimeout(() => {
							error.style.display = 'none';
							window.localStorage.setItem('auth', `${res.data.token}`);
							location.href = '../pages/index.html';
						}, 2000);
					}
				})
				.catch((err) => {
					error.style.display = 'block';
					error.style.background = 'red';
					error.textContent = `entry denied`;
					setTimeout(() => {
						error.style.display = 'none';
						window.location.reload();
					}, 3000);
				});
	  });

logoutLink.addEventListener('click', (e) => {
	localStorage.removeItem('auth');
	location.href = '../pages/index.html';
});

loginDisplay === null || loginDisplay === void 0
	? void 0
	: loginDisplay.addEventListener('submit', (e) => {
			e.preventDefault();
			let body = {
				username: loginDisplay[0].value,
				password: loginDisplay[1].value,
			};
			axios
				.post(`${baseUrl}/login`, body)
				.then((res) => {
					if ((res.status = 200)) {
						error.style.display = 'block';
						error.textContent = 'entry successful';
						setTimeout(() => {
							error.style.display = 'none';
							window.localStorage.setItem('auth', `${res.data.token}`);
							location.href = '../pages/display.html';
						}, 2000);
					}
				})
				.catch((err) => {
					error.style.display = 'block';
					error.style.background = 'red';
					error.textContent = `entry denied`;
					setTimeout(() => {
						error.style.display = 'none';
						window.location.reload();
					}, 2000);
				})
				.catch((err) => console.log(err));
	  });
