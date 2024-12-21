// Check if user is logged in on page load
if (!sessionStorage.getItem("ChallengerName")) {
    window.location.href = "index.html";
}

let homeBtn = document.getElementById("homeBtn");
homeBtn.addEventListener("click", (e) => {
    let reset = confirm("This will reset all answers.")
    if (reset) {
        sessionStorage.clear();
        window.location.href = "index.html";
    }
})
async function getQuestions() {
    try {
        let response = await fetch("db.json");
        let data = await response.json();
        return data.questions;
    } catch (e) {
        return [];
    }
}

// Retrieve challenger name from session storage
const challengerName = sessionStorage.getItem('ChallengerName') || 'Guest';
document.getElementById('challengerName').textContent = challengerName;

// Retrieve all user answers from session storage
const userAnswers = {};
for (let key in sessionStorage) {
    if (key.startsWith('answer_')) {
        userAnswers[key] = parseInt(sessionStorage.getItem(key));
    }
}



getQuestions().then(data => {
    displayResultSummary(data);
    displayDetailedAnswers(data);
}).catch(error => console.error('Error fetching questions:', error));

// Function to calculate and display the result summary
function displayResultSummary(questions) {
    let score = 0;
    let totalQuestions = questions.length;

    questions.forEach((question, index) => {
        const userAnswerKey = `answer_${index}`;
        if (userAnswers[userAnswerKey] === question.correct_answer) {
            score++;
        }
    });

    const resultSummary = `
        <p class="fs-4 text-center">You answered <strong>${score}</strong> out of <strong>${totalQuestions}</strong> questions correctly.</p>
        <div class="progress">
            <div class="progress-bar bg-success" role="progressbar" style="width: ${(score / totalQuestions) * 100}%;" aria-valuenow="${score}" aria-valuemin="0" aria-valuemax="${totalQuestions}">${((score / totalQuestions) * 100).toFixed(1)}%</div>
        </div>
    `;

    document.getElementById('resultSummary').innerHTML = resultSummary;
}

// Function to display detailed answers
function displayDetailedAnswers(questions) {
    const detailedAnswersContainer = document.getElementById('detailedAnswers');
    let detailsHTML = '';

    questions.forEach((question, index) => {
        const userAnswerKey = `answer_${index}`;
        const userAnswer = userAnswers[userAnswerKey];
        const correctAnswer = question.correct_answer;
        const isCorrect = userAnswer === correctAnswer;
        const userAnswerText = userAnswer !== undefined ? question.answers[userAnswer] : 'No Answer';
        const correctAnswerText = question.answers[correctAnswer];

        detailsHTML += `
            <div class="accordion-item">
                <h2 class="accordion-header" id="heading${index}">
                    <button class="accordion-button ${isCorrect ? 'text-success' : 'text-danger'}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}" aria-expanded="true" aria-controls="collapse${index}">
                        Question ${index + 1}: ${isCorrect ? '✅ Correct' : '❌ Incorrect'}
                    </button>
                </h2>
                <div id="collapse${index}" class="accordion-collapse collapse" aria-labelledby="heading${index}" data-bs-parent="#detailedAnswers">
                    <div class="accordion-body">
                        <p><strong>Question:</strong> ${question.question}</p>
                        <p><strong>Your Answer:</strong> ${userAnswerText}</p>
                        <p><strong>Correct Answer:</strong> ${correctAnswerText}</p>
                        <p><strong>Explanation:</strong> ${question.explanation}</p>
                    </div>
                </div>
            </div>
        `;
    });

    detailedAnswersContainer.innerHTML = detailsHTML;
}
