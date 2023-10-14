// const { doc } = require("prettier");

// Your web app's Firebase configuration
var firebaseConfig = {
    // put your api stuff here
    apiKey: "AIzaSyCT4ilVsx9OHQwazEKXgPyHaV1wus6e_Ik",
  authDomain: "test1-69744.firebaseapp.com",
  databaseURL: "https://test1-69744-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "test1-69744",
  storageBucket: "test1-69744.appspot.com",
  messagingSenderId: "587694443578",
  appId: "1:587694443578:web:f0123996bd6f63ed8ef903",
  measurementId: "G-0LBGW6RB64"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  // Initialize variables
  const auth = firebase.auth()
  const database = firebase.database()
  const storage = firebase.storage()
  
  let currentUser;

  // Check the user's authentication state on page load
 
  let isTestMoodAdded = false; // Flag to track if test mood records have been added

  auth.onAuthStateChanged((user) => {
      if (user) {
          // User is signed in
          currentUser = user;
  
          //checkAndEnableButtons();
          window.addEventListener('load', checkAndEnableButtons);
  
          

          setInterval(checkAndEnableButtons, 5000);
  
        // test normal
        //   if (!isTestMoodAdded) {
        //       addTestMoodRecords(); // Call the function only if test mood records haven't been added yet
        //       isTestMoodAdded = true; // Set the flag to true after adding test mood records
        //   }
          
        //test september
        //   if (!isTestMoodAdded) {
        //     addTestMoodRecordsForSeptember(); // Call the function only if test mood records haven't been added yet
        //     isTestMoodAdded = true; // Set the flag to true after adding test mood records
        // }
          // ...
      } else {
          // User is signed out
          currentUser = null;
          checkAndEnableButtons();
      }
  });
  

logoutButton.addEventListener('click', () => {
    // Sign the user out
    auth.signOut().then(() => {
      // Redirect the user to the login page after logout
      alert("User logged out");
      window.location.href = 'home.html'; // Replace with the actual login page URL
      
    }).catch((error) => {
      // Handle any errors that occur during sign-out
      console.error('Error signing out:', error);
    });
  });

//timer
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


const addMinutesButton = document.getElementById("add-minutes-button");
addMinutesButton.addEventListener("click", addMinutes);

function addMinutes() {
    if (!isPaused) {

        countdownTime += 60; // Add 60 seconds (1 minute) to the countdown time
        updateDisplay(countdownTime);
    }
}


function togglediv(id) {
    var div = document.getElementById(id);
    if (div) {
        if (div.style.display === "none" || div.style.display === "") {
            div.style.display = "block";
        } else {
            div.style.display = "none";
        }
    }
}
function toggleMoodDiv(id) {
    var div = document.getElementById(id);
    if (div) {
        if (div.style.display === "none" || div.style.display === "") {
            div.style.display = "block";
        } else {
            div.style.display = "none";
        }
    }
}




// JavaScript
const pointsButton = document.getElementById('pointsButton');
const pointsValue = document.getElementById('pointsValue');

// Function to fetch and display the user's current points (simulate fetching)
let currentPoints = 0; // Initialize points with 0

// Function to fetch and display the user's current points
function getCurrentPoints() {
    // Update points
    currentPoints += 20; // Increase points by 10 (adjust the increment as needed)
    pointsValue.textContent = currentPoints;
}

// Function to update points periodically (e.g., every 5 seconds)
function updatePointsInterval() {
    getCurrentPoints(); // Initial call to get points
    setInterval(getCurrentPoints, 5000); // Update points every 5 seconds (adjust the interval as needed)
}


function storePointsInFirebase(points) {
    // Get a reference to the user's points in Firebase
    const pointToDatabase = database.ref('users/' + currentUser.uid + '/points');

    // Retrieve the current points from Firebase
    pointToDatabase.once('value').then(function(snapshot) {
        const userData = snapshot.val();


        // Calculate the updated total points
        // const currentPoints = userData ? (userData.Points || 0) : 0;
        // Check if userData exists (i.e., if there is existing points data in Firebase)
        let currentPoints;

        if (userData && userData.Points !== undefined && userData.Points !== null) {
            currentPoints = userData.Points;
        } else {
            currentPoints = 0;
        }

        const updatedPoints = currentPoints + points;

        // Set the updated total points in Firebase
        pointToDatabase.set({
            Points: updatedPoints,
        });

        console.log('Points stored in Firebase:', updatedPoints);
    });
}

// Function to reset points to 0
function resetPoints() {
    currentPoints = 0; // Set points to 0
    getCurrentPoints(); // Update points display
}
// Add a click event listener to the button
    pointsButton.addEventListener('click', function () {
    const currentPoints = parseInt(pointsValue.textContent);

    storePointsInFirebase(currentPoints);
    
    resetPoints()
    alert('Points stored in Firebase: ' + currentPoints);
});

// Initialize the points display and start the update interval
getCurrentPoints();
updatePointsInterval();



var currentImageIndex = 0; // Initialize the current image index
var imagePaths = ["bg1.jpeg", "bg2.jpg", "bg3.jpeg","bg4.jpg"]; // Replace with your image paths

function changeBackgroundImage() {
  // Select the div with id "studyBG"
  var studyBGDiv = document.getElementById("studyBG");

  // Fetch the next image URL from Firebase Storage
  storage
    .ref("imagebackground/" + imagePaths[currentImageIndex])
    .getDownloadURL()
    .then(function (url) {
      // Set the background image to the fetched image URL
      studyBGDiv.style.backgroundImage = "url(" + url + ")";
    })
    .catch(function (error) {
      console.error("Error fetching image URL:", error);
    });

  // Increment the current image index or reset it to 0 if it reaches the end
  currentImageIndex = (currentImageIndex + 1) % imagePaths.length;
}

function recordMood(mood) {
    // Get the current user (you may need to implement user authentication)
    if (currentUser) {
        const userMoodRef = database.ref("users/" + currentUser.uid + "/mood");

        // Push the mood data with a timestamp
        userMoodRef.push({
            mood: mood,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        }).then(() => {
            console.log('Mood recorded successfully:', mood);
            // Call the function to update button states after recording mood
            checkAndEnableButtons();
        }).catch((error) => {
            console.error('Error recording mood:', error);
        });
    } else {
        console.log('User not logged in.');
    }
}

let lastButtonClickTime = 0;

// Function to enable the buttons
function enableButtons() {
    document.getElementById('happy-button').removeAttribute('disabled');
    document.getElementById('sad-button').removeAttribute('disabled');
    document.getElementById('normal-button').removeAttribute('disabled');
}

// Function to disable the buttons
function disableButtons() {
    document.getElementById('happy-button').setAttribute('disabled', 'true');
    document.getElementById('sad-button').setAttribute('disabled', 'true');
    document.getElementById('normal-button').setAttribute('disabled', 'true');
}

// Event listeners for button clicks
document.getElementById('happy-button').addEventListener('click', () => {
    lastButtonClickTime = Date.now(); // Update the last button click time
    enableButtons(); // Enable the buttons after a click
});

document.getElementById('sad-button').addEventListener('click', () => {
    lastButtonClickTime = Date.now(); // Update the last button click time
    enableButtons(); // Enable the buttons after a click
});

document.getElementById('normal-button').addEventListener('click', () => {
    lastButtonClickTime = Date.now(); // Update the last button click time
    enableButtons(); // Enable the buttons after a click
});

// Call checkAndEnableButtons initially to set the initial button state


function checkAndEnableButtons() {
    if (currentUser) {
        const currentTime = Date.now();
        const fiveSecondsInMilliseconds = 15 * 1000;

        // Check if 5 seconds have passed since the last button click
        if (currentTime - lastButtonClickTime >= fiveSecondsInMilliseconds) {
            // Enable the buttons because 5 seconds have passed
            enableButtons();
        } else {
            // Disable the buttons because it hasn't been 5 seconds yet
            disableButtons();
        }
    } else {
        console.log('User not logged in.');
    }
}








// // Function to add multiple mood records for testing
// function addTestMoodRecords() {
//     // Replace 'currentUser.uid' with the actual user's UID
//     const userMoodRef = database.ref("users/" + currentUser.uid + "/mood");

//     // Define some emoji codes for testing
//     const emojiCodes = ['&#128514', '&#128514', '&#128514', '&#128514','&#128514','&#128514']; // Emoji codes for 😂, 😁, and 😂

//     // Loop through the emoji codes and add them as new mood records
//     emojiCodes.forEach((emojiCode) => {
//         const newMoodRecord = {
//             mood: emojiCode,
//             timestamp: firebase.database.ServerValue.TIMESTAMP
//         };

//         // Push the new mood record to Firebase
//         userMoodRef.push(newMoodRecord)
//             .then(() => {
//                 console.log('New mood record added successfully:', emojiCode);
//             })
//             .catch((error) => {
//                 console.error('Error adding new mood record:', error);
//             });
//     });
// }


// function addTestMoodRecordsForSeptember() {
//     // Replace 'currentUser.uid' with the actual user's UID
//     const userMoodRef = database.ref("users/" + currentUser.uid + "/mood");

//     // Define some emoji codes for testing
//     const emojiCodes = ['&#128514']; // Emoji codes for 😂, 😁, and 😂

//     // Loop through the emoji codes and add them as new mood records for September
//     emojiCodes.forEach((emojiCode) => {
//         const currentDate = new Date();
//         currentDate.setMonth(8); // Set the month to September (JavaScript months are zero-based)
//         const timestamp = currentDate.getTime();

//         const newMoodRecord = {
//             mood: emojiCode,
//             timestamp: timestamp
//         };

//         // Push the new mood record to Firebase
//         userMoodRef.push(newMoodRecord)
//             .then(() => {
//                 console.log('New mood record added successfully for September:', emojiCode);
//             })
//             .catch((error) => {
//                 console.error('Error adding new mood record for September:', error);
//             });
//     });
// }








