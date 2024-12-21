
/* Start get name , validate and store it */
let inputNameElement = document.getElementById("challenger-name");
let startQuizBtn = document.getElementById("start-quiz-btn");
let errorMessageElement = document.getElementById("error-message");

inputNameElement.addEventListener("input", () => {
    errorMessageElement.textContent = "";
});

if (sessionStorage.getItem("ChallengerName")) {
    inputNameElement.value = sessionStorage.getItem("ChallengerName");
}
startQuizBtn.onclick = function (e) {
    e.preventDefault();
    let EnteredName = inputNameElement.value.trim();
    if (EnteredName == "" || EnteredName.length < 3) {
        errorMessageElement.textContent = "Please Enter A valid Name";
    }
    else {
        sessionStorage.setItem("ChallengerName", EnteredName);
        window.location.href = "quiz.html";
    }

}
/* end get name */