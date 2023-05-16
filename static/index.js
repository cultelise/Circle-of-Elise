'use strict';
const main = document.querySelector('main');
const post1 = document.getElementById('post-1');
const postButton1 = document.getElementById('post-button-1');
const postTitle1 = document.getElementById('post-link-1');
const postContent1 = document.getElementById('post-content-1');
const hideBox = document.getElementById('opaque-layer');
const eyeClosed = document.getElementById('eye-closed');
const eyeOpen = document.getElementById('eye-open');
const initForm = document.getElementById('initiation-form');
const initName = document.getElementById('codename');
const buttonHandler = function (e) {
	const target = e.target;
	let button;
	if (target.id == 'post-button-1') {
		button = e.target;
	}
	button.style.opacity = '0';
	post1.style.opacity = '0';
	post1.style.pointerEvents = 'none';
	button.style.fontSize = '30px';
	timeOut(button);
};
const timeOut = function (button) {
	setTimeout(function () {
		if (eyeClosed.className == 'hide') {
			eyeClosed.className = 'show';
			eyeOpen.className = 'hide';
			button.style.fontSize = '40px';
			button.style.opacity = '100';
			post1.style.opacity = '100';
			postContent1.className = 'hide';
			postTitle1.style.borderBottom = '1px solid black';
		} else {
			eyeClosed.className = 'hide';
			eyeOpen.className = 'show';
			button.style.fontSize = '40px';
			button.style.opacity = '100';
			post1.style.opacity = '100';
			postContent1.className = 'show';
			postTitle1.style.borderBottom = 'none';
		}
	}, 300);
	setTimeout(function () {
		post1.style.pointerEvents = 'auto';
	}, 500);
};
postButton1 === null || postButton1 === void 0
	? void 0
	: postButton1.addEventListener('click', buttonHandler);
postTitle1 === null || postTitle1 === void 0
	? void 0
	: postTitle1.addEventListener('click', buttonHandler);
console.log(initForm);
initForm.addEventListener('submit', async () => {
	await axios.post('http://localhost:3000/initiation', {
		codename: initForm[0].value,
		email: initForm[1].value,
		password: initForm[2].value,
	});
});
