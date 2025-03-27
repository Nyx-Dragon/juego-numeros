// --- Elementos del DOM ---
const guessInput = document.getElementById("guessInput");
const guessButton = document.getElementById("guessButton");
const message = document.getElementById("message");
const attemptsInfo = document.getElementById("attempts");
const playAgainButton = document.getElementById("playAgainButton");
const guessesList = document.getElementById("guessesList");
const highScoreInfo = document.createElement("p"); // Para mostrar el high score
document.querySelector(".container").appendChild(highScoreInfo);

// --- Variables del Juego ---
let secretNumber;
let attempts;
const MAX_ATTEMPTS = 10;
const MAX_NUMBER = 100;
const MIN_NUMBER = 1;
let highScore = localStorage.getItem("highScore") ? parseInt(localStorage.getItem("highScore")) : null;

// --- Funciones ---

// Función para iniciar o reiniciar el juego
function startGame() {
    secretNumber = Math.floor(Math.random() * MAX_NUMBER) + MIN_NUMBER;
    attempts = 0;
    message.textContent = "";
    message.className = "message";
    attemptsInfo.textContent = `Intentos: ${attempts} / ${MAX_ATTEMPTS}`;
    guessInput.value = "";
    guessInput.disabled = false;
    guessButton.disabled = false;
    playAgainButton.style.display = "none";
    guessesList.innerHTML = "";
    guessInput.focus();
    updateHighScoreDisplay();
    console.log(`Pssst... el número secreto es ${secretNumber}`);
}

// Función para manejar el intento del usuario
function handleGuess() {
    const userGuessText = guessInput.value;
    if (userGuessText === "") {
        setMessage("Por favor, introduce un número.", "info");
        return;
    }
    const userGuess = parseInt(userGuessText);
    if (isNaN(userGuess) || userGuess < MIN_NUMBER || userGuess > MAX_NUMBER) {
        setMessage(`Introduce un número válido entre ${MIN_NUMBER} y ${MAX_NUMBER}.`, "info");
        guessInput.value = "";
        guessInput.focus();
        return;
    }

    attempts++;
    attemptsInfo.textContent = `Intentos: ${attempts} / ${MAX_ATTEMPTS}`;
    
    const listItem = document.createElement("li");
    listItem.textContent = userGuess;
    guessesList.appendChild(listItem);
    
    if (userGuess === secretNumber) {
        setMessage(`¡Correcto! 🎉 El número era ${secretNumber}. Lo adivinaste en ${attempts} intentos.`, "correct");
        checkHighScore();
        endGame();
    } else if (userGuess < secretNumber) {
        setMessage("¡Demasiado bajo! Intenta un número más alto. 👇", "wrong");
    } else {
        setMessage("¡Demasiado alto! Intenta un número más bajo. 👆", "wrong");
    }

    if (attempts >= MAX_ATTEMPTS && userGuess !== secretNumber) {
        setMessage(`¡Has perdido! 😢 El número era ${secretNumber}.`, "wrong");
        endGame();
    }
    
    if (userGuess !== secretNumber) {
        guessInput.value = "";
        guessInput.focus();
    }
}

// Función para mostrar mensajes
function setMessage(msg, type) {
    message.textContent = msg;
    message.className = `message ${type}`;
}

// Función para terminar el juego
function endGame() {
    guessInput.disabled = true;
    guessButton.disabled = true;
    playAgainButton.style.display = "inline-block";
}

// Función para actualizar la mejor puntuación
function checkHighScore() {
    if (highScore === null || attempts < highScore) {
        highScore = attempts;
        localStorage.setItem("highScore", highScore);
        updateHighScoreDisplay();
    }
}

// Función para mostrar la mejor puntuación en pantalla
function updateHighScoreDisplay() {
    highScoreInfo.textContent = highScore ? `Mejor puntuación: ${highScore} intentos 🎯` : "Aún no hay mejor puntuación";
}

// --- Event Listeners ---
guessButton.addEventListener("click", handleGuess);
guessInput.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        handleGuess();
    }
});
playAgainButton.addEventListener("click", startGame);

// --- Iniciar el juego al cargar la página ---
startGame();
