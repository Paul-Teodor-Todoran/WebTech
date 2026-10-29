let questions = [
    {
        question: "Te-ai apucat de ideea de proiect?",
        options: {
            a: "Da, am deja o schiță!",
            b: "Nu încă, dar mă gândesc la ceva",
            c: "Nu prea știu ce să fac..."
        },
        correctAnswer: "a",
        correctResponse: "Excelent! Abia aștept să văd ce iese!",
        incorrectResponse: "Nu-i nimic! Discutăm idei împreună"
    },
    {
        question: "Cum merge echipa ta la proiect?",
        options: {
            a: "Ne organizăm bine!",
            b: "Mai greu cu sincronizarea...",
            c: "Sunt singur"
        },
        correctAnswer: "a",
        correctResponse: "Foarte tare! Munca în echipă e cheia succesului!",
        incorrectResponse: "O să găsim soluții împreună, nu-ți face griji"
    }
];

let currentQuestionIndex = 0;
let chatContainer = document.getElementById("chat-container");
let chatForm = document.getElementById("chat-form");
let userInput = document.getElementById("user-input");
displayQuestion();

function displayQuestion() {
    let currentQuestion = questions[currentQuestionIndex];
    let optionsHTML = Object.keys(currentQuestion.options)
        .map(key => `${key}. ${currentQuestion.options[key]}`)
        .join(" | ");
    let botResponse = document.createElement("div");
    botResponse.classList.add("message");
    botResponse.innerHTML = `<strong>Bot:</strong>
    ${currentQuestion.question}<br>${optionsHTML}`;
    chatContainer.appendChild(botResponse);
    scrollChatContainerToBottom();
}

function scrollChatContainerToBottom() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

chatForm.addEventListener("submit", function(event) {
    event.preventDefault();
    let userResponse = userInput.value.toLowerCase().trim();
    if (userResponse === "") return;
    if (!Object.prototype.hasOwnProperty.call(questions[currentQuestionIndex].options, userResponse)) {
        alert("Alege a, b sau c.");
        return;
    }
    let userMessage = document.createElement("div");
    userMessage.classList.add("message");
    userMessage.textContent = `You: ${userResponse}`;
    chatContainer.appendChild(userMessage);
    let currentQuestion = questions[currentQuestionIndex];
    let botResponse = document.createElement("div");
    botResponse.classList.add("message");
    botResponse.innerHTML = `<strong>Bot:</strong> `;
    if (userResponse === currentQuestion.correctAnswer) {
        botResponse.innerHTML += currentQuestion.correctResponse;
    } else {
        botResponse.innerHTML += currentQuestion.incorrectResponse;
    }
    chatContainer.appendChild(botResponse);
    currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
    userInput.value = "";
    userInput.disabled = true;
    scrollChatContainerToBottom();
    setTimeout(() => {
        displayQuestion();
        userInput.disabled = false;
        userInput.focus();
        scrollChatContainerToBottom();
    }, 800);
});
