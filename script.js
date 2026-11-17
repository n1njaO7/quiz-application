
//1. DOM ELEMENTS

const adminTab = document.getElementById("adminTab");
const userTab = document.getElementById("userTab");

const adminPanel = document.getElementById("adminPanel");
const userPanel = document.getElementById("userPanel");

const questionForm = document.getElementById("questionForm");
const questionInput = document.getElementById("questionInput");

const optionInputs = document.querySelectorAll(".optionInput");
const correctAnswer = document.getElementById("correctAnswer");

const adminQuestions = document.getElementById("adminQuestions");

const quizStart = document.getElementById("quizStart");
const quizSection = document.getElementById("quizSection");
const resultSection = document.getElementById("resultSection");

const startBtn = document.getElementById("startBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");

const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");
const progress = document.getElementById("progress");
const answeredCount = document.getElementById("answeredCount");


//2. APPLICATION STATE


// Load questions from LocalStorage

let questions = JSON.parse(
    localStorage.getItem("quizQuestions")
) || [];

// Current question index

let currentQuestion = 0;

// Store user answers

let answers = [];


//3. SAVE QUESTIONS


function saveQuestions() {

    localStorage.setItem(
        "quizQuestions",
        JSON.stringify(questions)
    );

}


//4. SWITCH TABS


adminTab.addEventListener("click", () => {

    adminPanel.classList.remove("hidden");
    userPanel.classList.add("hidden");

    adminTab.classList.add("active");
    userTab.classList.remove("active");

});


userTab.addEventListener("click", () => {

    adminPanel.classList.add("hidden");
    userPanel.classList.remove("hidden");

    userTab.classList.add("active");
    adminTab.classList.remove("active");

});


//5. ADD QUESTION

questionForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const question = questionInput.value.trim();

    const options = Array.from(optionInputs).map(input =>
        input.value.trim()
    );

    const answer = correctAnswer.value;

    if (
        !question ||
        options.some(option => !option) ||
        answer === ""
    ) {

        alert("Please fill all fields!");

        return;

    }

    const newQuestion = {

        id: Date.now(),

        question: question,

        options: options,

        correctAnswer: Number(answer)

    };

    questions.push(newQuestion);

    saveQuestions();

    questionForm.reset();

    renderAdminQuestions();

    alert("Question added successfully!");

});


//6. DISPLAY ADMIN QUESTIONS


function renderAdminQuestions() {

    adminQuestions.innerHTML = "";

    if (questions.length === 0) {

        adminQuestions.textContent = "No questions available.";

        return;

    }

    questions.forEach((question, index) => {

        const div = document.createElement("div");

        div.className = "question-card";

        const title = document.createElement("p");

        title.textContent =
            `${index + 1}. ${question.question}`;

        const deleteBtn = document.createElement("button");

        deleteBtn.textContent = "Delete";

        deleteBtn.className = "delete-btn";

        deleteBtn.addEventListener("click", () => {

            deleteQuestion(question.id);

        });

        div.append(title, deleteBtn);

        adminQuestions.appendChild(div);

    });

}


//7. DELETE QUESTION


function deleteQuestion(id) {

    questions = questions.filter(question =>
        question.id !== id
    );

    saveQuestions();

    renderAdminQuestions();

}


//8. START QUIZ


startBtn.addEventListener("click", () => {

    if (questions.length === 0) {

        alert("No questions available!");

        return;

    }

    // Reset quiz state

    currentQuestion = 0;

    answers = new Array(questions.length).fill(null);

    // Show quiz screen

    quizStart.classList.add("hidden");

    resultSection.classList.add("hidden");

    quizSection.classList.remove("hidden");

    showQuestion();

});


//9. DISPLAY QUESTION


function showQuestion() {

    const question = questions[currentQuestion];

    // Update question number

    progress.textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;

    // Update answered count

    const answered = answers.filter(answer =>
        answer !== null
    ).length;

    answeredCount.textContent =
        `Answered: ${answered}`;

    // Display question

    questionText.textContent = question.question;

    // Clear previous options

    optionsContainer.innerHTML = "";

    // Display four options

    question.options.forEach((option, index) => {

        const div = document.createElement("div");

        div.className = "option";

        div.textContent =
            `${String.fromCharCode(65 + index)}. ${option}`;

        // Highlight selected answer

        if (answers[currentQuestion] === index) {

            div.classList.add("selected");

        }

        // Select answer

        div.addEventListener("click", () => {

            answers[currentQuestion] = index;

            showQuestion();

        });

        optionsContainer.appendChild(div);

    });

    // Disable previous on first question

    prevBtn.disabled = currentQuestion === 0;

    // Change button text on last question

    nextBtn.textContent =
        currentQuestion === questions.length - 1
            ? "Submit Quiz"
            : "Next";

}


//10. PREVIOUS QUESTION

prevBtn.addEventListener("click", () => {

    if (currentQuestion > 0) {

        currentQuestion--;

        showQuestion();

    }

});


//11. NEXT QUESTION / SUBMIT

nextBtn.addEventListener("click", () => {

    // Validate answer

    if (answers[currentQuestion] === null) {

        alert("Please select an answer!");

        return;

    }

    // Move to next question

    if (currentQuestion < questions.length - 1) {

        currentQuestion++;

        showQuestion();

    } else {

        showResult();

    }

});


//12. CALCULATE RESULT

function showResult() {

    let correct = 0;

    questions.forEach((question, index) => {

        if (answers[index] === question.correctAnswer) {

            correct++;

        }

    });

    const total = questions.length;

    const incorrect = total - correct;

    const percentage = (correct / total) * 100;


    // Display total questions

    document.getElementById("totalQuestions").textContent =
        total;

    // Display correct answers

    document.getElementById("correctAnswers").textContent =
        correct;

    // Display incorrect answers

    document.getElementById("incorrectAnswers").textContent =
        incorrect;

    // Display final score

    document.getElementById("finalScore").textContent =
        `${correct} / ${total}`;

    // Display percentage

    document.getElementById("percentage").textContent =
        `${percentage.toFixed(2)}%`;


    // Switch screens

    quizSection.classList.add("hidden");

    resultSection.classList.remove("hidden");

}


//13. RESTART QUIZ

restartBtn.addEventListener("click", () => {

    currentQuestion = 0;

    answers = [];

    resultSection.classList.add("hidden");

    quizStart.classList.remove("hidden");

});


//14. INITIAL RENDERING
 

renderAdminQuestions();
