//timer
let timer;
let countdownTime = 1500; // 25 minutes in seconds
let isPaused = false; // To track whether the timer is paused
let additionalTime = 0;
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
 
  if (time === 0) {  // Disable the decrease button when the timer hits 0
    minusMinutesButton.disabled = true;
    startplayresumeButton.disabled =true

  } else {
    minusMinutesButton.disabled = false;
    startplayresumeButton.disabled =false;
  }
}

function toggleTimer() {
    if (timer == null) {
      // timer has no value when start timer for the first time
      timer = setInterval(function () {
        if (!isPaused) {
          // Only decrement the time if not paused
          countdownTime--;
          if (countdownTime === 0) {
            handleTimerZero()
          
            clearInterval(timer);
  
          }
          updateDisplay(countdownTime);
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
    if (countdownTime === 0) {
      updateDisplay(countdownTime);
      minusMinutesButton.disabled = false; // Enable decrease button
      startplayresumeButton.disabled = false; // Enable Start Play Resume button
      countdownTime += 300; // Add 300 seconds (5 minutes) for example, you can change this value
    } else if (!isPaused || isPaused) {
      countdownTime += 300; // Add 300 seconds (5 minutes) to the countdown time
      updateDisplay(countdownTime);
    }
    updateDisplay(countdownTime);
  }
  
  function minusMinutes() {
    if (!isPaused || isPaused) {
      if (countdownTime > 0) {
      countdownTime -= 300; // minus 300 seconds (1 minute) to the countdown time
      minusMinutesButton.disabled = false;
      updateDisplay(countdownTime);
    }
    else{
      minusMinutesButton.disabled = true;
      updateDisplay(countdownTime);

    }
    }
  }
  
  function handleTimerZero() {
    icon.src = "../img/play.png";
    const successBody = document.querySelector('#successModal .modal-body');
    successBody.innerText = "Time's up!";
  
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();
    
    clearInterval(timer);
    resetTimer()
  }
  
  startplayresumeButton.addEventListener("click", toggleTimer);
  resetButton.addEventListener("click", resetTimer);
  addMinutesButton.addEventListener("click", addMinutes);
  minusMinutesButton.addEventListener("click", minusMinutes);
  
  