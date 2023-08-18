const hamburgerMenu = document.querySelector('.hamburger-menu');
const bigWrapper = document.querySelector('.big-wrapper');
hamburgerMenu.addEventListener('click' , function () {
    bigWrapper.classList.toggle('active');
})

const card1 = document.querySelector('.card-1 a');
const card2 = document.querySelector('.card-2 a');
const card3 = document.querySelector('.card-3 a');

// Fetch questions based on the Clicked Card
card1.addEventListener('click', function () {
    goToQuizPage('html')
});
card2.addEventListener('click', function () {
    goToQuizPage('css')
});
card3.addEventListener('click', function () {
    goToQuizPage('js')
});

function goToQuizPage(file) {
    sessionStorage.clear();
    sessionStorage.setItem('file', file);
}