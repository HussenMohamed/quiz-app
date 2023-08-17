const hamburgerMenu = document.querySelector('.hamburger-menu');
const bigWrapper = document.querySelector('.big-wrapper');
hamburgerMenu.addEventListener('click' , function () {
    bigWrapper.classList.toggle('active');
})