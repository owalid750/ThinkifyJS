// Check if user is logged in on page load
if (!sessionStorage.getItem("ChallengerName")) {
    window.location.href = "index.html";
}
document.getElementById("w-challengerName").textContent = sessionStorage.getItem("ChallengerName");
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

let currentQuestionIndex = 0;

async function loadQuestion(index) {
    const questions = await getQuestions();
    const question = questions[index];

    const questionCardHTML = `
        <div class="card question-card">
            <div class="card-header">
                Question #${question.id}
            </div>
            <div class="card-body">
                <!-- Image -->
                <div class="mb-4">
                    <img src="${question.image || 'https://via.placeholder.com/800x250.png?text=No+Image+Available'}" class="image-placeholder" alt="Question Image">
                </div>

                <!-- Question -->
                <h5 class="card-title">${question.question}</h5>

                <!-- Hint -->
                <p class="hint-text">hint: ${question.hint}</p>

                <!-- Answer Choices -->
                <form id="answersForm">
                    ${question.answers.map((answer, index) => `
                        <div class="form-check">
                            <input type="radio" class="form-check-input" name="answer" id="answer${index}" value="${index}">
                            <label class="form-check-label answer-label" for="answer${index}">${answer}</label>
                        </div>
                    `).join('')}
                </form>

                <!-- Difficulty Badge -->
                <span class="badge bg-danger">Difficulty: ${question.difficulty}</span>
            </div>

            <!-- Navigation Buttons -->
            <div class="card-footer navigation-btns">
                <button class="btn btn-secondary" id="prevBtn" ${index === 0 ? 'disabled' : ''}>Previous</button>
                ${index === questions.length - 1 ? `<button class="btn btn-success" id="submitBtn" disabled>Submit</button>` : `<button class="btn main-btn" id="nextBtn" ${index === questions.length - 1 ? 'disabled' : ''}disabled>Next</button>`}
            </div>
        </div>
    `;

    document.getElementById('questionCardContainer').innerHTML = questionCardHTML;

    // Get previously saved answer from sessionStorage
    const savedAnswer = sessionStorage.getItem(`answer_${index}`);
    if (savedAnswer !== null) {
        const radioButton = document.querySelector(`input[name="answer"][value="${savedAnswer}"]`);
        if (radioButton) {
            radioButton.checked = true; // Mark the radio button as checked
            // Enable the "Next" button after selecting an answer
            const nextBtn = document.getElementById('nextBtn');
            const submitBtn = document.getElementById("submitBtn");
            if (nextBtn) {
                nextBtn.disabled = false; // Enable the button if it exists.
            }
            // enable submit btn
            if (submitBtn) {
                submitBtn.disabled = false;
            }

        }
    }

    // Event listener to save the selected answer to sessionStorage
    document.getElementById('answersForm').addEventListener('change', function (event) {
        const selectedAnswerIndex = event.target.value; // Get the index of the selected answer in shuffled answers
        // Save the selected answer in sessionStorage with the question index as a key
        sessionStorage.setItem(`answer_${index}`, selectedAnswerIndex);

        // Enable the "Next" button after selecting an answer
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById("submitBtn");
        if (nextBtn) {
            nextBtn.disabled = false; // Enable the button if it exists.
        }
        // enable submit btn
        if (submitBtn) {
            submitBtn.disabled = false;
        }


    });

    // Previous and Next  and submit buttons
    document.getElementById('prevBtn')?.addEventListener('click', () => {
        loadQuestion(index - 1);
    });
    document.getElementById('nextBtn')?.addEventListener('click', () => {
        loadQuestion(index + 1);
    });
    document.getElementById("submitBtn")?.addEventListener("click", () => {
        window.location.href = "result.html";
    });

}

// Load the first question on page load
window.onload = () => loadQuestion(currentQuestionIndex);

