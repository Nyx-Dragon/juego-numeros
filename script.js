// Obtención de elementos del DOM
// Se obtienen referencias a los elementos HTML por su ID para manipularlos en el juego
const guessInput = document.getElementById("guessInput"); // Campo de entrada del usuario
const guessButton = document.getElementById("guessButton"); // Botón para enviar el intento
const message = document.getElementById("message"); // Mensaje de información al usuario
const attemptsInfo = document.getElementById("attempts"); // Contador de intentos
const playAgainButton = document.getElementById("playAgainButton"); // Botón para reiniciar el juego
const guessesList = document.getElementById("guessesList"); // Lista donde se muestran los intentos anteriores

// Variables del juego
let secretNumber; // Número secreto a adivinar
let attempts; // Contador de intentos
let maxAttempts = 10; // Intentos máximos permitidos
let minNumber = 1; // Número mínimo en el rango
let maxNumber = 100; // Número máximo en el rango (cambia con la dificultad)
// Recupera la mejor puntuación almacenada en localStorage o la deja en null si no existe
let bestScore = localStorage.getItem("bestScore") ? parseInt(localStorage.getItem("bestScore")) : null;

// Creación del selector de dificultad cuando se carga la página
document.addEventListener("DOMContentLoaded", () => {
    const difficultySelect = document.createElement("select"); // Crea un elemento <select>
    difficultySelect.innerHTML = `
        <option value="50">Fácil (1-50)</option>
        <option value="100" selected>Medio (1-100)</option>
        <option value="200">Difícil (1-200)</option>
    `;
    // Inserta el selector después del <h1> en la página
    document.querySelector(".container").insertBefore(difficultySelect, document.querySelector("h1").nextSibling);
    
    // Evento que cambia el rango de números cuando se cambia la dificultad
    difficultySelect.addEventListener("change", () => {
        maxNumber = parseInt(difficultySelect.value); // Asigna el nuevo límite superior del rango
        startGame(); // Reinicia el juego con la nueva configuración
    });
});

// Función para iniciar o reiniciar el juego
function startGame() {
    secretNumber = Math.floor(Math.random() * maxNumber) + minNumber; // Genera un número aleatorio
    attempts = 0; // Reinicia el contador de intentos
    message.textContent = `He pensado en un número entre ${minNumber} y ${maxNumber}. ¿Puedes adivinar cuál es?`;
    message.className = "message"; // Restablece la clase del mensaje
    attemptsInfo.textContent = `Intentos: 0 / ${maxAttempts}`; // Reinicia el contador en pantalla
    guessInput.value = ""; // Limpia el campo de entrada
    guessInput.disabled = false; // Habilita el campo de entrada
    guessButton.disabled = false; // Habilita el botón de adivinar
    playAgainButton.style.display = "none"; // Oculta el botón de jugar de nuevo
    guessesList.innerHTML = ""; // Borra la lista de intentos previos
    guessInput.focus(); // Coloca el cursor en el campo de entrada
    
    // Muestra la mejor puntuación si existe
    if (bestScore !== null) {
        const bestScoreInfo = document.getElementById("bestScore");
        if (!bestScoreInfo) { // Si no existe el elemento, se crea uno nuevo
            const newElement = document.createElement("p");
            newElement.id = "bestScore";
            newElement.textContent = `Mejor puntuación: ${bestScore} intentos`;
            document.querySelector(".container").appendChild(newElement);
        } else {
            bestScoreInfo.textContent = `Mejor puntuación: ${bestScore} intentos`;
        }
    }
    
    console.log(`Pssst... el número secreto es ${secretNumber}`); // Muestra el número secreto en la consola (para pruebas)
}

// Función que maneja el intento del usuario
function handleGuess() {
    const userGuess = parseInt(guessInput.value); // Convierte la entrada a un número entero
    if (isNaN(userGuess) || userGuess < minNumber || userGuess > maxNumber) { // Validación de entrada
        setMessage(`Introduce un número válido entre ${minNumber} y ${maxNumber}.`, "info");
        guessInput.value = "";
        guessInput.focus();
        return;
    }
    
    attempts++; // Incrementa el contador de intentos
    attemptsInfo.textContent = `Intentos: ${attempts} / ${maxAttempts}`; // Actualiza la interfaz
    
    // Almacenar y mostrar los números ingresados
    const listItem = document.createElement("li"); // Crea un nuevo elemento <li>
    listItem.textContent = userGuess; // Le asigna el número ingresado
    guessesList.appendChild(listItem); // Lo agrega a la lista en la interfaz
    
    // Verifica si el usuario ha adivinado el número
    if (userGuess === secretNumber) {
        setMessage(`¡Correcto! 🎉 El número era ${secretNumber}. Lo adivinaste en ${attempts} intentos.`, "correct");
        endGame(); // Finaliza el juego
    } else if (userGuess < secretNumber) {
        setMessage("¡Demasiado bajo! Intenta un número más alto. 👇", "wrong");
    } else {
        setMessage("¡Demasiado alto! Intenta un número más bajo. 👆", "wrong");
    }
    
    // Si se supera el número máximo de intentos, se finaliza el juego
    if (attempts >= maxAttempts) {
        setMessage(`¡Has perdido! 😞 El número era ${secretNumber}.`, "wrong");
        endGame();
    }
    
    guessInput.value = ""; // Limpia el campo de entrada para el siguiente intento
    guessInput.focus(); // Vuelve a enfocar el input
}

// Función para actualizar mensajes en la interfaz
function setMessage(msg, type) {
    message.textContent = msg; // Asigna el texto del mensaje
    message.className = `message ${type}`; // Asigna una clase CSS para el estilo
}

// Función para finalizar el juego
function endGame() {
    guessInput.disabled = true; // Deshabilita el campo de entrada
    guessButton.disabled = true; // Deshabilita el botón de adivinar
    playAgainButton.style.display = "inline-block"; // Muestra el botón de jugar de nuevo
    
    // Verifica y actualiza la mejor puntuación si se ha logrado una mejor marca
    if (attempts <= maxAttempts && (bestScore === null || attempts < bestScore)) {
        bestScore = attempts;
        localStorage.setItem("bestScore", bestScore); // Almacena la mejor puntuación en localStorage
        setMessage(`¡Nuevo récord! 🎉 Mejor puntuación: ${bestScore} intentos.`, "correct");
    }
}

// Event listeners para interacción del usuario
guessButton.addEventListener("click", handleGuess); // Clic en el botón de adivinar
guessInput.addEventListener("keyup", function(event) {
    if (event.key === "Enter") { // Si el usuario presiona Enter
        event.preventDefault();
        handleGuess(); // Llama a la función de adivinanza
    }
});
playAgainButton.addEventListener("click", startGame); // Clic en "Jugar de nuevo" reinicia el juego

// Inicia el juego al cargar la página
startGame();
