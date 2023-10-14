//timer
let timer;
let countdownTime = 1500; // 25 minutes in seconds
let isPaused = false; // To track whether the timer is paused

const display = document.getElementById("timer-display");

const startplayresumeButton = document.getElementById(
  "start-play-resume-button"
);
const icon = document.getElementById("icon");
const resetButton = document.getElementById("reset-button");
const addMinutesButton = document.getElementById("add-minutes-button");
const minusMinutesButton = document.getElementById("minus-minutes-button");

function updateDisplay(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
  display.textContent = formattedTime;
}

function toggleTimer() {
    if (timer == null) {
      // timer has no value when start timer for the first time
      timer = setInterval(function () {
        if (!isPaused) {
          // Only decrement the time if not paused
          countdownTime--;
          updateDisplay(countdownTime);
        }
        if (countdownTime === 0) {
          clearInterval(timer);
          alert("Time's up!");
        }
      }, 1000);
  
      icon.src = "../img/pause.png";
    } else {
      isPaused = !isPaused;
      if (isPaused) {
        icon.src = "../img/play.png";
      } else {
        icon.src = "../img/pause.png";
      }
    }
  }
  
  function resetTimer() {
    clearInterval(timer);
    timer = null; // returns no value so can click play after reset
    countdownTime = 1500;
    updateDisplay(countdownTime);
    isPaused = false; // Reset the pause state
    icon.src = "../img/play.png";
  }
  
  function addMinutes() {
    if (!isPaused || isPaused) {
      countdownTime += 60; // Add 60 seconds (1 minute) to the countdown time
      updateDisplay(countdownTime);
    }
  }
  
  function minusMinutes() {
    if (!isPaused || isPaused) {
      countdownTime -= 60; // minus 60 seconds (1 minute) to the countdown time
      updateDisplay(countdownTime);
    }
  }
  
  startplayresumeButton.addEventListener("click", toggleTimer);
  resetButton.addEventListener("click", resetTimer);
  addMinutesButton.addEventListener("click", addMinutes);
  minusMinutesButton.addEventListener("click", minusMinutes);
  