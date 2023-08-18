// SELECT ELEMENTS
const quizApp = document.querySelector('.quiz-app');
const questionArea = document.querySelector('.quiz-area');
const countSpan = document.querySelector('.quiz-info .count span');
const categorySpan = document.querySelector('.quiz-info .category span');
const bulletsElement = document.querySelector('.bullets');
const bulletsSpans = document.querySelector('.bullets .spans');
const answersArea = document.querySelector('.answers-area');
const nextButton = document.querySelector('.next-button');
const backButton = document.querySelector('.back-button');
const countdownElement = document.querySelector('.countdown');


// SET OPTIONS
let currentQuestion = 0;
let countdownInterval;


let file = sessionStorage.getItem('file');
getQuestions(file);


// Function to just get the question from JSON file based on the category
async function getQuestions(category) {
    try {
        // get the questions from JSON file of the required category
        const response = await fetch(`questions/${category}-questions.json`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Convert the promise into a JSON 
        const data = await response.json();

        // Assume that the quiz will contain 10 questions
        let questionsCount = 10;
        // This function selects (questionsCount) number of questions randomly from the JavaScript Object 
        let chosenQuestions =  selectNumberOfQuestions(data, questionsCount);

        // Update the category of the Quiz
        updateCategory(category);
        // Create pagination bullets depending on the length of the chosenQuestion array
        createBullets(chosenQuestions.length);

        // Start Countdown
        countdown(10, chosenQuestions);

        // Append the question and it's choices into the page
        PostToWebPage(chosenQuestions[currentQuestion], chosenQuestions.length);

        nextButton.addEventListener('click', function() {
            handleButtonClicked(true, chosenQuestions);

            // If reached the end of the questions
            if (currentQuestion >= chosenQuestions.length) {
                questionArea.remove();
                answersArea.remove();
                showResult(chosenQuestions);
                questionsRevision(chosenQuestions);
            }
        });
        
        backButton.addEventListener('click', function() {
            handleButtonClicked(false, chosenQuestions);
        });


    } catch (error) {
        console.log('Error fetching data:', error);
    }

}

// Function to choose (count) random questions from the array
function selectNumberOfQuestions(array, count) {
    shuffle(array);
    return array.slice(0, count);
}


// Function to shuffle the Questions Array
function shuffle(array) {
    let current = array.length;
    let random;

    while (current > 0) {
        random = Math.floor(Math.random() * current);
        current--;
        [array[current], array[random]] = [array[random], array[current]];
    }
    return array;
}



// Function to post the question and choices to the DOM
function PostToWebPage(question, count) {
    
    // To be sure that currentQuestion (index) did not exceed the length of the array of questions
    if (currentQuestion < count) {
        // Create the header which contains the question
        const questionHeader = document.createElement('h2');
        const questionText = document.createTextNode(question.title);

        // Append the text to the header element
        questionHeader.appendChild(questionText);

        // Append the header to the question area element
        questionArea.appendChild(questionHeader);

        // Create the answers
        for(let i = 1 ; i <= 4 ; i++) {
            // Create the Div with answer class
            const mainDiv = document.createElement('div');
            mainDiv.classList.add('answer');

            // Create radio input
            const radioInput = document.createElement('input');
            // Add type + name + id + data-attribute
            radioInput.name = 'question';
            radioInput.type = 'radio';
            radioInput.id = `answer_${i}`;
            radioInput.dataset.answer = question[`answer_${i}`];



            // Create Label
            const label = document.createElement('label');
            label.htmlFor = `answer_${i}`;
            // Create label text
            const labelText = document.createTextNode(question[`answer_${i}`])
            //Append the text to the label
            label.appendChild(labelText);

            // see if this qustion was solved before
            if (question.hasOwnProperty('state')) {
                if (question.state == true && question[`answer_${i}`] === question.right_answer) {
                    radioInput.checked = true;
                } else if (question.state == false && question[`answer_${i}`] === question.wrong_answer){
                    radioInput.checked = true;
                }                
            }


            // Append the input and the label to the main div
            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(label);

            answersArea.appendChild(mainDiv);
        }
    }

}

// Function that creates pagination bullets
function createBullets(num) {
    countSpan.innerHTML = num;

    // Create Spans
    for(let i = 1 ; i <= num ; i++) {
        // Create Span contains numbers from 1 to num
        let bullet = document.createElement('span')
        bullet.innerHTML = i;

        // Check if the counter equals the order of the currentQuestion
        if (i === currentQuestion+1) {
            bullet.classList.add('active');
        }

        // Append Bullets to main bullet container
        bulletsSpans.appendChild(bullet);

    }
}

// Function to get the right answer and compare it with the answer of the user
function checkAnswer(question, rightAnswer) {

    // create array that contains the 4 choices
    const answers = document.getElementsByName("question");

    // create a variable to store the chosen answer of the user
    let chosenAnswer;

    // iterate on the array of answers to get the checked input (chosen answer)
    for (let i = 0 ; i < 4 ; i++) {
        if(answers[i].checked) {
            chosenAnswer = answers[i].dataset.answer;
        }
    }

    if (chosenAnswer == rightAnswer) {
        // Create a new key in the object called state = true
        question.state = true;
    } else {
        // create a new keys in the object => state = false | wrong_answer = chosenAnswer 
        question.state = false;
        // if the user did not choose any choice then wrong_answer = none
        question.wrong_answer = chosenAnswer != undefined ? chosenAnswer : 'none' ;
    }
}

// function to change the active class on the pagination bullets
function handleBullets() {
    const arrayOfSpans = Array.from(bulletsSpans.children);
    arrayOfSpans.forEach((span,index) => {
        if (index === currentQuestion) {
            span.classList.add('active');
        } else {
            span.classList.remove('active');
        }
    });
}

// Function to change the question when the user ckicks in next or back buttons
function handleButtonClicked(isNextButton, questions) {
    // Get right answer
    const rightAnswer = questions[currentQuestion][`right_answer`];

    // Check the answer
    checkAnswer(questions[currentQuestion], rightAnswer);

    // Empty the questionArea and answersArea to get the new question
    questionArea.innerHTML = '';
    answersArea.innerHTML = '';

    // Update currentQuestion based on isNextButton value
    if (isNextButton) {
        currentQuestion++;
    } else {
        currentQuestion--;
        
    }

    // Append the new question and its choices into the page
    PostToWebPage(questions[currentQuestion], questions.length);

    // Handle Bullets Class
    handleBullets();
}

// Function to show the result after finishing the questions
function showResult(questions) {

    // Function to get the number of the right answers
    const rightAnswersCount = handleRightAnswers(questions);

    const circularProgress = document.createElement('div');
    circularProgress.classList.add('circular-progress');

    const progressValue = document.createElement('div');
    progressValue.classList.add('progress-value');


    progressValue.innerHTML = `<span class="right-count">0</span>/<span class="total-count">${questions.length}</span>`;
    circularProgress.appendChild(progressValue);

    quizApp.appendChild(circularProgress);

    nextButton.remove();
    backButton.remove();
    bulletsElement.remove();

    let progressStartValue = 0,
        progressEndValue = rightAnswersCount,
        speed = 100;
        degreeFactor = 360 / questions.length;
    let progress = setInterval(() => {
        if (progressStartValue == progressEndValue) {
            clearInterval(progress);
        }
        

        progressValue.innerHTML = `<span class="right-count">${progressStartValue}</span>/<span class="total-count">${questions.length}</span>`;

        circularProgress.style.background = `conic-gradient(var(--mainColor) ${degreeFactor * progressStartValue}deg, #ededed 0deg)`;
        progressStartValue++;

    }, speed);

}

// Function to get the number of the right answers
function handleRightAnswers(questions) {
    let rightAnswersCount = 0;
    // Iterate on all the questions and get the right answers count
    questions.forEach(question => {
        if (question.state === true) {
            rightAnswersCount++;
        }
    });
    console.log('From handleRightAnswers function:');
    console.log(rightAnswersCount);
    return rightAnswersCount;
}
// Function to see your answers again and the correction of your wrong answers 
function questionsRevision(questions) {
    // container of all the answers
    const quizRevision = document.createElement('div');
    quizRevision.classList.add('quiz-rev');

    for(let i = 0 ; i < 10 ; i++) {
        // Box element holds the question and all the answers
        const box = document.createElement('div');
        box.classList.add('box');
    
        const questionRev = document.createElement('h4');
        questionRev.classList.add('question-rev');
        questionRev.appendChild(document.createTextNode(questions[i].title));
        box.appendChild(questionRev);
    
        const answersRev = document.createElement('div');
        answersRev.classList.add('answers-rev');

        for (let answerIndex = 1 ; answerIndex <= 4 ; answerIndex++) {
            const answer = document.createElement('span');
            answer.appendChild(document.createTextNode(questions[i][`answer_${answerIndex}`]));

            // If the current answer is the right answer then add class 'right-answer'
            if ( questions[i][`answer_${answerIndex}`] == questions[i][`right_answer`]) {
                answer.classList.add('right-answer');

            } else if (questions[i].state === false) {
                if (questions[i][`answer_${answerIndex}`] == questions[i].wrong_answer) {
                    // if the current answer is the wrong answer that the user had chosen
                    answer.classList.add('wrong-answer');
                } else if (questions[i].wrong_answer == 'none') {
                    // If the user did not choose any answer
                    answer.classList.add('wrong-answer');
                }
            } else if (!questions[i].hasOwnProperty('state')) {
                // If timer is passed without slving the rest of the questions
                answer.classList.add('wrong-answer');
            }
            answersRev.appendChild(answer);
        }
        box.appendChild(answersRev);
        quizRevision.appendChild(box);
        quizApp.appendChild(quizRevision);
    }
}

//update Category of the quiz in the quiz info
function updateCategory(category) {
    if(category === 'html'){
        categorySpan.innerHTML = 'HTML';
    } else if (category === 'css') {
        categorySpan.innerText = 'CSS';
    } else {
        categorySpan.innerText = 'JavaScript';
    }
}

// function to control the countdown timer
function countdown(duration, questions) {

    let minutes, seconds;
    countdownInterval = setInterval(() => {
        if (currentQuestion >= questions.length) {
            return;
        }
        // Get the minutes only (division operator)
        minutes = parseInt(duration / 60);
        // Get the seconds only (modulus operator)
        seconds = parseInt(duration % 60);
        minutes = minutes < 10 ? `0${minutes}` : minutes ; 
        seconds = seconds < 10 ? `0${seconds}` : seconds ;
        countdownElement.innerHTML = `${minutes}:${seconds}`;
        if (--duration < 0 || currentQuestion >= questions.length) {
            clearInterval(countdownInterval);
            questionArea.remove();
            answersArea.remove();
            showResult(questions);
            questionsRevision(questions);
        }
    }, 1000);
}