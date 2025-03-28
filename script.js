// Obtención de elementos del DOM
const guessInput = document.getElementById("guessInput");
const guessButton = document.getElementById("guessButton");
const message = document.getElementById("message");
const attemptsInfo = document.getElementById("attempts");
const playAgainButton = document.getElementById("playAgainButton");
const guessesList = document.getElementById("guessesList");

// Variables del juego
let secretNumber;
let attempts;
let maxAttempts = 10;
let minNumber = 1;
let maxNumber = 100;
let bestScore = localStorage.getItem("bestScore") ? parseInt(localStorage.getItem("bestScore")) : null;

// Creación del selector de dificultad
document.addEventListener("DOMContentLoaded", () => {
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
});

// Función para iniciar el juego
function startGame() {
    secretNumber = Math.floor(Math.random() * maxNumber) + minNumber;
    attempts = 0;
    message.textContent = `He pensado en un número entre ${minNumber} y ${maxNumber}. ¿Puedes adivinar cuál es?`;
    message.className = "message";
    attemptsInfo.textContent = `Intentos: 0 / ${maxAttempts}`;
    guessInput.value = "";
    guessInput.disabled = false;
    guessButton.disabled = false;
    playAgainButton.style.display = "none";
    guessesList.innerHTML = "";
    guessInput.focus();
    
    if (bestScore !== null) {
        const bestScoreInfo = document.getElementById("bestScore");
        if (!bestScoreInfo) {
            const newElement = document.createElement("p");
            newElement.id = "bestScore";
            newElement.textContent = `Mejor puntuación: ${bestScore} intentos`;
            document.querySelector(".container").appendChild(newElement);
        } else {
            bestScoreInfo.textContent = `Mejor puntuación: ${bestScore} intentos`;
        }
    }
    
    console.log(`Pssst... el número secreto es ${secretNumber}`);
}

// Función para manejar el intento del usuario
function handleGuess() {
    const userGuess = parseInt(guessInput.value);
    if (isNaN(userGuess) || userGuess < minNumber || userGuess > maxNumber) {
        setMessage(`Introduce un número válido entre ${minNumber} y ${maxNumber}.`, "info");
        guessInput.value = "";
        guessInput.focus();
        return;
    }
    
    attempts++;
    attemptsInfo.textContent = `Intentos: ${attempts} / ${maxAttempts}`;
    const listItem = document.createElement("li");
    listItem.textContent = userGuess;
    guessesList.appendChild(listItem);
    
    if (userGuess === secretNumber) {
        setMessage(`¡Correcto! 🎉 El número era ${secretNumber}. Lo adivinaste en ${attempts} intentos.`, "correct");
        endGame();
    } else if (userGuess < secretNumber) {
        setMessage("¡Demasiado bajo! Intenta un número más alto. 👇", "wrong");
    } else {
        setMessage("¡Demasiado alto! Intenta un número más bajo. 👆", "wrong");
    }
    
    if (attempts >= maxAttempts) {
        setMessage(`¡Has perdido! 😞 El número era ${secretNumber}.`, "wrong");
        endGame();
    }
    
    if (userGuess !== secretNumber) {
        guessInput.value = "";
        guessInput.focus();
    }
}

// Función para mostrar mensajes de estado en el juego
function setMessage(msg, type) {
    message.textContent = msg;
    message.className = `message ${type}`;
}

// Función para finalizar el juego
function endGame() {
    guessInput.disabled = true;
    guessButton.disabled = true;
    playAgainButton.style.display = "inline-block";

    if (attempts <= maxAttempts && (bestScore === null || attempts < bestScore)) {
        bestScore = attempts;
        localStorage.setItem("bestScore", bestScore);
        setMessage(`¡Nuevo récord! 🎉 Mejor puntuación: ${bestScore} intentos.`, "correct");
    }
}

// Event listeners para botones y teclado
guessButton.addEventListener("click", handleGuess);
guessInput.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        handleGuess();
    }
});
playAgainButton.addEventListener("click", startGame);

// Iniciar el juego al cargar la página
startGame();
