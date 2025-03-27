// --- Elementos del DOM ---
const guessInput = document.getElementById("guessInput");
const guessButton = document.getElementById("guessButton");
const message = document.getElementById("message");
const attemptsInfo = document.getElementById("attempts");
const playAgainButton = document.getElementById("playAgainButton");
const guessesList = document.getElementById("guessesList");

// --- Variables del Juego ---
let secretNumber, attempts;
const maxAttempts = 10;
let minNumber = 1;
let maxNumber = 100;

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
    secretNumber = Math.floor(Math.random() * maxNumber) + minNumber;
    attempts = 0;
    updateUI(`He pensado en un número entre ${minNumber} y ${maxNumber}. ¿Puedes adivinar cuál es?`, "message");
    attemptsInfo.textContent = `Intentos: 0 / ${maxAttempts}`;
    resetGame();
    console.log(`Pssst... el número secreto es ${secretNumber}`);
}

function handleGuess() {
    const userGuess = parseInt(guessInput.value);
    if (isNaN(userGuess) || userGuess < minNumber || userGuess > maxNumber) {
        return updateUI(`Introduce un número válido entre ${minNumber} y ${maxNumber}.`, "info");
    }

    attempts++;
    attemptsInfo.textContent = `Intentos: ${attempts} / ${maxAttempts}`;
    guessesList.innerHTML += `<li>${userGuess}</li>`;

    if (userGuess === secretNumber) {
        return endGame(`¡Correcto! 🎉 El número era ${secretNumber}. Lo adivinaste en ${attempts} intentos.`, "correct");
    }
    
    if (attempts >= maxAttempts) {
        return endGame(`¡Has perdido! 😞 El número era ${secretNumber}.`, "wrong");
    }

    updateUI(userGuess < secretNumber ? "¡Demasiado bajo! 👇" : "¡Demasiado alto! 👆", "wrong");
    guessInput.value = "";
    guessInput.focus();
}

function updateUI(msg, type) {
    message.textContent = msg;
    message.className = `message ${type}`;
}

function endGame(msg, type) {
    updateUI(msg, type);
    guessInput.disabled = guessButton.disabled = true;
    playAgainButton.style.display = "inline-block";
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
