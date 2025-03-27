// --- Elementos del DOM ---
const guessInput = document.getElementById("guessInput");
const guessButton = document.getElementById("guessButton");
const message = document.getElementById("message");
const attemptsInfo = document.getElementById("attempts");
const playAgainButton = document.getElementById("playAgainButton");
const guessesList = document.getElementById("guessesList");

// --- Variables del Juego ---
let secretNumber;
let attempts;
const MAX_NUMBER = 100;
const MIN_NUMBER = 1;

// --- Función para iniciar/reiniciar el juego ---
function startGame() {
    secretNumber = Math.floor(Math.random() * MAX_NUMBER) + MIN_NUMBER;
    attempts = 0;

    // Restablecer la interfaz
    message.textContent = "";
    message.className = "message"; 
    attemptsInfo.textContent = "Intentos: 0";
    guessesList.innerHTML = ""; // Vacía la lista de intentos anteriores
    guessInput.value = "";
    guessInput.disabled = false;
    guessButton.disabled = false;
    playAgainButton.style.display = "none";
    guessInput.focus();

    console.log(`Pssst... el número secreto es ${secretNumber}`);
}

// --- Función para manejar el intento ---
function handleGuess() {
    const userGuessText = guessInput.value.trim();

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
    attemptsInfo.textContent = `Intentos: ${attempts}`;

    // Añadir intento a la lista con color visual
    const listItem = document.createElement("li");
    listItem.textContent = userGuess;
    listItem.style.color = userGuess < secretNumber ? "blue" : userGuess > secretNumber ? "red" : "green";
    guessesList.appendChild(listItem);

    if (userGuess === secretNumber) {
        setMessage(`¡Correcto! 🎉 El número era ${secretNumber}. Lo adivinaste en ${attempts} intentos.`, "correct");
        endGame();
    } else if (userGuess < secretNumber) {
        setMessage("¡Demasiado bajo! Intenta un número más alto. 👇", "wrong");
    } else {
        setMessage("¡Demasiado alto! Intenta un número más bajo. 👆", "wrong");
    }

    guessInput.value = "";
    guessInput.focus();
}

// --- Función para mostrar mensajes al usuario ---
function setMessage(msg, type) {
    message.textContent = msg;
    message.className = `message ${type}`;
}

// --- Función para finalizar el juego ---
function endGame() {
    guessInput.disabled = true;
    guessButton.disabled = true;
    playAgainButton.style.display = "inline-block";
}

// --- Event Listeners ---
guessButton.addEventListener("click", handleGuess);
guessInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        handleGuess();
    }
});
playAgainButton.addEventListener("click", startGame);

// --- Iniciar el juego al cargar la página ---
startGame();
