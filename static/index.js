var main = document.querySelector('main');
var post1 = document.getElementById('post-1');
var postButton1 = document.getElementById('post-button-1');
var postTitle1 = document.getElementById('post-title-1');
var postContent1 = document.getElementById('post-content-1');
var hideBox = document.getElementById('opaque-layer');
var eyeClosed = document.getElementById('eye-closed');
var eyeOpen = document.getElementById('eye-open');
var buttonHandler = function (e) {
    var target = e.target;
    var button;
    if (target.id == 'post-button-1') {
        button = e.target;
    }
    button.style.opacity = '0';
    post1.style.opacity = '0';
    post1.style.pointerEvents = 'none';
    button.style.fontSize = '30px';
    timeOut(button);
};
var timeOut = function (button) {
    setTimeout(function () {
        if (eyeClosed.className == 'hide') {
            eyeClosed.className = 'show';
            eyeOpen.className = 'hide';
            button.style.fontSize = '40px';
            button.style.opacity = '100';
            post1.style.opacity = '100';
            postContent1.className = 'hide';
            postTitle1.style.borderBottom = '1px solid black';
        }
        else {
            eyeClosed.className = 'hide';
            eyeOpen.className = 'show';
            // button.textContent = '☼';
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
postButton1.addEventListener('click', buttonHandler);
postTitle1.addEventListener('click', buttonHandler);
