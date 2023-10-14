let timer;
let countdownTime = 1500; // 25 minutes in seconds
let isPaused = false; // To track whether the timer is paused

const display = document.getElementById("timer-display");
const startButton = document.getElementById("start-button");
const pauseButton = document.getElementById("pause-button"); // Add a "Pause" button
const resetButton = document.getElementById("reset-button");

function updateDisplay(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    display.textContent = formattedTime;
}

function startTimer() {
    timer = setInterval(function() {
        if (!isPaused) { // Only decrement the time if not paused
            countdownTime--;
            updateDisplay(countdownTime);
        }
        if (countdownTime === 0) {
            clearInterval(timer);
            alert("Time's up!");
        }
    }, 1000);
    startButton.disabled = true;
    pauseButton.disabled = false; // Enable the "Pause" button when starting
}

function pauseTimer() {
    isPaused = !isPaused; // Toggle the pause state
    if (isPaused) {
        pauseButton.textContent = "Resume"; // Change button text to "Resume" when paused
    } else {
        pauseButton.textContent = "Pause"; // Change button text back to "Pause" when resumed
    }
}

function resetTimer() {
    clearInterval(timer);
    countdownTime = 1500;
    updateDisplay(countdownTime);
    isPaused = false; // Reset the pause state
    pauseButton.textContent = "Pause"; // Reset the "Pause" button text
    startButton.disabled = false;
    pauseButton.disabled = true; // Disable the "Pause" button when resetting
}

startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer); // Add event listener for the "Pause" button
resetButton.addEventListener("click", resetTimer);


