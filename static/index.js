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

const getPosts = async () => {
	let response = await axios.get(`${baseUrl}/posts`);
	return response.data;
};

if (mainMain) {
	const createPostCards = async () => {
		for (let i = 1; i <= 3; i++) {
			let post = await getPosts();
			post = post[i - 1];
			console.log(post);
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
							console.log(e.target);
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
							console.log(e.target);
							// let response1 = await axios.get(`${baseUrl}/display`);
							// console.log(response1);
							window.localStorage.setItem('post', `${idNum}`);
							window.location.href = '../pages/display.html';
					  });

				card.appendChild(button);
				title.appendChild(link);
				card.appendChild(title);
				card.appendChild(preview);
				mainMain.appendChild(card);
			}
		}
	};

	createPostCards();
}

if (displayPage) {
	const display = async () => {
		console.log('on the display page');
		let id = +window.localStorage.getItem('post');
		let response = await axios.get(`${baseUrl}/post/${id}`);
		let post = response.data[0];
		let postDiv = document.createElement('div');
		postDiv.id = 'display-post';
		let titleDiv = document.createElement('h1');
		let contentDiv = document.createElement('div');
		let commentDiv = document.createElement('div');
		let user = document.createElement('h3');
		let commentContent = document.createElement('div');
		console.log(post);
		titleDiv.textContent = post.title;
		contentDiv.textContent = post.content;

		postDiv.appendChild(titleDiv);
		postDiv.appendChild(contentDiv);
		displayPage.appendChild(postDiv);
	};
	display();
}

initForm === null || initForm === void 0
	? void 0
	: initForm.addEventListener('submit', async (event) => {
			event.preventDefault();
			await axios.post(`${baseUrl}/users`, {
				username: initForm[0].value,
				email: initForm[1].value,
				password: initForm[2].value,
			});
	  });

contentButton === null || contentButton === void 0
	? void 0
	: contentButton.addEventListener('click', async (e) => {
			e.preventDefault();
			console.log(contentBox);
			let response = await axios.post('http://localhost:3000/post', {
				title: contentTitle.value,
				content: contentBox.value,
				preview: postPreview.value,
			});
			console.log(response.data);
	  });

loginForm === null || loginForm === void 0
	? void 0
	: loginForm.addEventListener('submit', (e) => {
			e.preventDefault();
			let body = {
				username: loginForm[0].value,
				password: loginForm[1].value,
			};
			console.log(body);
			axios
				.post(`${baseUrl}/login`, body)
				.then((res) => {
					console.log(res);
				})
				.catch((err) => console.log(err));
	  });

const displayHandler = (event) => {
	event.target;
};
