// --- Elementos del DOM ---
const guessInput = document.getElementById("guessInput");
const guessButton = document.getElementById("guessButton");
const message = document.getElementById("message");
const attemptsInfo = document.getElementById("attempts");
const playAgainButton = document.getElementById("playAgainButton");
const guessesList = document.getElementById("guessesList");
const highScoreInfo = document.createElement("p");
document.querySelector(".container").appendChild(highScoreInfo);

// --- Variables del Juego ---
let secretNumber, attempts;
const MAX_ATTEMPTS = 10;
const MIN_NUMBER = 1;
let maxNumber = 100;
let highScore = localStorage.getItem("highScore") ? parseInt(localStorage.getItem("highScore")) : null;

// --- Selector de dificultad ---
const difficultySelect = document.createElement("select");
difficultySelect.innerHTML = `
    <option value="50">Fácil (1-50)</option>
    <option value="100" selected>Medio (1-100)</option>
    <option value="200">Difícil (1-200)</option>
`;
document.querySelector(".container").insertBefore(difficultySelect, document.querySelector("h1").nextSibling);

difficultySelect.addEventListener("change", () => {
    maxNumber = parseInt(difficultySelect.value);
    startGame();
});

// --- Funciones ---
function startGame() {
    secretNumber = Math.floor(Math.random() * maxNumber) + MIN_NUMBER;
    attempts = 0;
    setMessage(`He pensado en un número entre ${MIN_NUMBER} y ${maxNumber}. ¿Puedes adivinar cuál es?`, "message");
    attemptsInfo.textContent = `Intentos: 0 / ${MAX_ATTEMPTS}`;
    resetGame();
    updateHighScoreDisplay();
    console.log(`Pssst... el número secreto es ${secretNumber}`);
}

function handleGuess() {
    const userGuess = parseInt(guessInput.value);
    if (isNaN(userGuess) || userGuess < MIN_NUMBER || userGuess > maxNumber) {
        return setMessage(`Introduce un número válido entre ${MIN_NUMBER} y ${maxNumber}.`, "info");
    }

    attempts++;
    attemptsInfo.textContent = `Intentos: ${attempts} / ${MAX_ATTEMPTS}`;
    guessesList.innerHTML += `<li>${userGuess}</li>`;

    if (userGuess === secretNumber) return endGame(`¡Correcto! 🎉 El número era ${secretNumber}.`, "correct");
    if (attempts >= MAX_ATTEMPTS) return endGame(`¡Has perdido! 😞 El número era ${secretNumber}.`, "wrong");
    
    setMessage(userGuess < secretNumber ? "¡Demasiado bajo! 👇" : "¡Demasiado alto! 👆", "wrong");
    guessInput.value = "";
    guessInput.focus();
}

function setMessage(msg, type) {
    message.textContent = msg;
    message.className = `message ${type}`;
}

function endGame(msg, type) {
    setMessage(msg, type);
    guessInput.disabled = guessButton.disabled = true;
    playAgainButton.style.display = "inline-block";
    checkHighScore();
}

function checkHighScore() {
    if (highScore === null || attempts < highScore) {
        highScore = attempts;
        localStorage.setItem("highScore", highScore);
        updateHighScoreDisplay();
    }
}

function updateHighScoreDisplay() {
    highScoreInfo.textContent = highScore ? `Mejor puntuación: ${highScore} intentos 🎯` : "Aún no hay mejor puntuación";
}

function resetGame() {
    guessInput.disabled = guessButton.disabled = false;
    playAgainButton.style.display = "none";
    guessesList.innerHTML = "";
    guessInput.value = "";
    guessInput.focus();
}

// --- Event Listeners ---
guessButton.addEventListener("click", handleGuess);
guessInput.addEventListener("keyup", (e) => e.key === "Enter" && handleGuess());
playAgainButton.addEventListener("click", startGame);

// --- Iniciar el juego ---
startGame();
