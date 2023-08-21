# ProgQz - Online Programming Quizzes
ProgQz is an interactive web application that offers multiple-choice quizzes in three programming topics: HTML, CSS, and JavaScript. Users can choose their preferred topic, take a quiz with 10 randomly selected questions, and receive immediate feedback on their answers.

## Live Demo
[ProgQz Website](https://hussenmohamed.github.io/quiz-app/)

## Features
- Choose from three programming topics: HTML, CSS, and JavaScript.
- Randomly generated quizzes with 10 questions each.
- Interactive quiz interface with countdown timer.
- Feedback on answers after completing each quiz, including right and wrong choices.
- Review section for revisiting quiz answers and corrections.

## Concepts Highlighted

### Fetch API and JSON Data
The web application fetches quiz questions using the Fetch API from JSON files based on the selected topic. This allows for dynamic content delivery and ensures a variety of questions in each quiz attempt.
```javascript
// Fetch questions based on the selected category
async function getQuestions(category) {
    try {
        const response = await fetch(`questions/${category}-questions.json`);
        const data = await response.json();
        // Select 10 random questions from the data
        let chosenQuestions = selectNumberOfQuestions(data, 10);
        // ...
    } catch (error) {
        console.log('Error fetching data:', error);
    }
}
```

### Random Question Selection
The application randomly selects a specified number of questions from the available data using the selectNumberOfQuestions function. This ensures that each quiz attempt is unique.
```javascript
function selectNumberOfQuestions(array, count) {
    shuffle(array); // Shuffle the questions array
    return array.slice(0, count); // Select the first 'count' questions
}
```

### Shuffling an Array
The shuffle function implements the Fisher-Yates shuffle algorithm to randomize the order of elements in an array.
```javascript
function shuffle(array) {
    // ...
    while (current > 0) {
        random = Math.floor(Math.random() * current);
        current--;
        [array[current], array[random]] = [array[random], array[current]];
    }
    return array;
}
```

### Countdown Timer
A countdown timer of 120 seconds is provided for each quiz attempt. The timer is implemented using JavaScript intervals and updates every second.
```javascript
function countdown(duration, questions) {
    let minutes, seconds;
    countdownInterval = setInterval(() => {
        // ...
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
```

### Rendering Questions and Answers
This function dynamically generates and appends HTML elements for the quiz questions and answer choices based on the provided data.
```javascript
function PostToWebPage(question, count) {
    // ...
    for(let i = 1 ; i <= 4 ; i++) {
        // ...
        // Append the input and the label to the main div
        mainDiv.appendChild(radioInput);
        mainDiv.appendChild(label);

        answersArea.appendChild(mainDiv);
    }
}
```

### Review and Corrections
After completing the quiz, users can review their answers and see which ones were correct and incorrect. The review section also includes the original question and choices.

