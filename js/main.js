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

          displayUserTodoList(user.uid);

          username()

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

function username(){
    if (!currentUser) {
        // Handle the case where userId is not defined
        console.error('userId is not defined');
        return;
    }
    const username = database.ref('users/' + currentUser.uid + '/full_name');

    const span = document.getElementById('username');

    username.on('value', function(snapshot){
        const fullname = snapshot.val()
        if(fullname !== null){
            span.textContent = fullname;
        }else{
            span.textContent = "UNKNOWN USERNAME"
        }
    }, function(error){
        console.error('Error listening for user full name:', error)
    }
    )
}


// Point System
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


// Change Background
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


function saveTodoList() {
    const todo = document.getElementById('input').value;
    

    if (!currentUser) {
        // The user is not signed in; handle this case accordingly
        alert('You need to sign in to add a note.');
        return;
    }

    

    // Ensure the user is signed in before adding a note
    const userNotesRef = database.ref('users/' + currentUser.uid + '/todo');

    // Push the note data to the user's notes in the Firebase database
    const newNoteRef = userNotesRef.push();
    newNoteRef.set({
        todo: todo,
        
    });

    // Clear the input fields after saving
    document.getElementById('input').value = '';
    

    // Optionally, you can add a success message or perform any other action
    alert('Note saved successfully!');
}

function displayUserTodoList(uid) {
    const display = document.getElementById('display');
    const todoInput = document.getElementById('input');
    

    // Reference to the user's notes in the database
    const userNotesRef = database.ref('users/' + uid + '/todo');

    // Listen for changes to the user's notes
    userNotesRef.on('value', (snapshot) => {
        display.innerHTML = ''; // Clear the existing notes

        // Loop through each note in the user's notes
        snapshot.forEach((childSnapshot) => {
            const note = childSnapshot.val();
            const noteId = childSnapshot.key;

            // Create a container for each note
            const noteContainer = document.createElement('div');
            noteContainer.className = 'todo-container';
            noteContainer.setAttribute('margin-top','10px');

            // Add a click event listener to each note container
            noteContainer.addEventListener('click', () => {
                // Display the clicked note in the preview area
                todoInput.value = note.todo;
                
            });

            // Create a delete button for the note

             const deleteButton = document.createElement('img');
            deleteButton.setAttribute('src', '../img/delete.png');
            deleteButton.setAttribute('width', '20px');
      

            // Add a click event listener to the delete button
            deleteButton.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent the click event from propagating to the note container
                deleteListFromDatabase(uid, noteId);
            });

            // Create a summary view for the note (e.g., only title)
            const summaryView = document.createElement('div');
            summaryView.className = 'notes__summary-view';
            summaryView.textContent = note.todo; // You can customize the summary view as needed

            // Append the summary view and delete button to the note container
            noteContainer.appendChild(summaryView);
            noteContainer.appendChild(deleteButton);

            // Append the note container to the notes list
            display.appendChild(noteContainer);
        });
    });
}

function deleteListFromDatabase(uid, noteId) {
    const userNotesRef = database.ref('users/' + uid + '/todo');

    const confirmed = window.confirm("Are you sure you want to delete?")

    if(confirmed){
        userNotesRef.child(noteId).remove();
    }

}

// Function to clear all to-do items from the user's to-do list
function clearToDoList(userId) {
    const userToDoListRef = database.ref('users/' + userId + '/todo');

    const confirmed = window.confirm("Are you sure you want to clear the entire list?")

    if(confirmed){
        userToDoListRef.remove();
    }
}

// Add an event listener to the "Clear List" button
const clearButton = document.getElementById('clearButton');

clearButton.addEventListener('click', () => {
    if (currentUser) {
        clearToDoList(currentUser.uid);
    } else {
        // The user is not signed in; handle this case accordingly
        alert('You need to sign in to clear the list.');
    }
});


var moodDataArray = []; // This array will store mood data objects

var moodChart; // Declare moodChart as a global variable

function recordMood(mood) {
    console.log(mood);
    // Get the current user (you may need to implement user authentication)
    if (currentUser) {
        const userMoodRef = database.ref("users/" + currentUser.uid + "/mood");

        // Create a timestamp for today in a format like 'YYYY-MM'
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1; // Note: Months are zero-indexed, so we add 1.
        const dateString = `${year}-${(month < 10 ? '0' : '')}${month}`;

        // Check if a mood entry for the current month already exists
        userMoodRef.child(dateString).once("value")
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const existingMoods = snapshot.val();

                    // Update the mood count based on the value of 'mood'
                    if (mood === 1) {
                        existingMoods.happy = (existingMoods.happy || 0) + 1;
                    } else if (mood === 2) {
                        existingMoods.sad = (existingMoods.sad  ||0) + 1;
                    } else if (mood === 3) {
                        existingMoods.angry = (existingMoods.angry || 0) + 1;
                    }

                    // Update the existing entry with the new mood values
                    userMoodRef.child(dateString).update(existingMoods).then(() => {
                        console.log('Mood updated successfully:', existingMoods);
                        // Call the function to update button states after updating mood
                        checkAndEnableButtons();
                    }).catch((error) => {
                        console.error('Error updating mood:', error);
                    });
                } else {
                    // If no entry exists for the current month, create a new entry
                    const newMoodEntry = {};

                    // Update the mood count based on the value of 'mood'
                    if (mood === 1) {
                        newMoodEntry.happy = 1;
                    } else if (mood === 2) {
                        newMoodEntry.sad = 1;
                    } else if (mood === 3) {
                        newMoodEntry.angry = 1;
                    }

                    userMoodRef.child(dateString).set(newMoodEntry).then(() => {
                        console.log('Mood recorded successfully:', newMoodEntry);
                        // Call the function to update button states after recording mood
                        checkAndEnableButtons();
                    }).catch((error) => {
                        console.error('Error recording mood:', error);
                    });
                }
            }).catch((error) => {
                console.error('Error checking mood entries:', error);
            });
    } else {
        console.log('User not logged in.');
    }
}

let lastButtonClickTime = 0;

// Function to enable the buttons
function enableButtons() {
    document.getElementById('happy-button').removeAttribute('disabled');
    document.getElementById('normal-button').removeAttribute('disabled');
    document.getElementById('sad-button').removeAttribute('disabled');
}

// Function to disable the buttons
function disableButtons() {
    document.getElementById('happy-button').setAttribute('disabled', 'true');
    document.getElementById('normal-button').setAttribute('disabled', 'true');
    document.getElementById('sad-button').setAttribute('disabled', 'true');
    
   
}

// Event listeners for button clicks
document.getElementById('happy-button').addEventListener('click', () => {
    lastButtonClickTime = Date.now(); // Update the last button click time
    enableButtons(); // Enable the buttons after a click
});

document.getElementById('normal-button').addEventListener('click', () => {
    lastButtonClickTime = Date.now(); // Update the last button click time
    enableButtons(); // Enable the buttons after a click
});

document.getElementById('sad-button').addEventListener('click', () => {
    lastButtonClickTime = Date.now(); // Update the last button click time
    enableButtons(); // Enable the buttons after a click
})


;
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








