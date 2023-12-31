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
  
  let userId;

  // Check the user's authentication state on page load
 
  let isTestMoodAdded = false; // Flag to track if test mood records have been added

  auth.onAuthStateChanged((user) => {
      if (user) {
          // User is signed in
          userId = user.uid;
  
          //checkAndEnableButtons();
          window.addEventListener('load', checkAndEnableButtons);

          displayUserTodoList(userId);
          profileImage()
        
          username()
          guide()

          setInterval(checkAndEnableButtons, 5000);
  
      } else {
          // User is signed out
          userId = null;
          window.location.href = '/index.html';
       
      }
  });
  

logoutButton.addEventListener('click', () => {
    // Sign the user out
    auth.signOut().then(() => {

        // Show the Bootstrap modal
    const logoutModal = new bootstrap.Modal(document.getElementById('logoutModal'));
    logoutModal.show();
   
    setInterval(function(){
      window.location.href = "/index.html",8000
    })
  
    
  }).catch((error) => {
    // Handle any errors that occur during sign-out
    console.error('Error signing out:', error);
  });
});

// TOGGLE DISPLAY FOR MAINPAGE OF THE FEATURES START
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
// TOGGLE DISPLAY FOR MAINPAGE OF THE FEATURES END


// FETCHING USER GENDER
function profileImage(){
    if (!userId) {
        // Handle the case where userId is not defined
        console.error('userId is not defined');
        return;
    }
    const genders = database.ref('users/' + userId + '/gender');

    const span = document.getElementById('profileImage');

    genders.on('value', function(snapshot){
        let gender = snapshot.val()
        if(gender == "Male"){
            let profileImage = document.createElement('img')
            profileImage.src = "../img/Ai_images/malerabbit.jpg";
            profileImage.classList.add('profileImage');
            span.appendChild(profileImage)
            
        }else{
            let profileImage = document.createElement('img')
            profileImage.src = "../img/Ai_images/femalerabbit.jpg";
            profileImage.classList.add('profileImage');
            span.appendChild(profileImage)
        }
    }, function(error){
        // console.error('Error listening for user full name:', error)
    }
    )
}
// FETCHING USERNAME START
function username(){
    if (!userId) {
        // Handle the case where userId is not defined
        console.error('userId is not defined');
        return;
    }
    const username = database.ref('users/' + userId + '/full_name');

    const span = document.getElementById('username');

    username.on('value', function(snapshot){
        const fullname = snapshot.val()
        if(fullname !== null){
            span.textContent = fullname;
        }else{
            console.log("UNKNOWN USERNAME")
        }
    }, function(error){
        // console.error('Error listening for user full name:', error)
    }
    )
}
// FETCHING USERNAME END


// POINT SYSTEM FEATURE START
const pointsButton = document.getElementById('pointsButton');
const pointsValue = document.getElementById('pointsValue');

// Function to fetch and display the user's current points (simulate fetching)
let currentPoints = 0; // Initialize points with 0

// Function to fetch and display the user's current points
function getCurrentPoints() {
    // Update points
    currentPoints += 25; // Increase points by 10 (adjust the increment as needed)
    pointsValue.textContent = currentPoints;
}

// Function to update points periodically (e.g., every 5 seconds)
function updatePointsInterval() {
    getCurrentPoints(); // Initial call to get points
    setInterval(getCurrentPoints, 10000); // Update points every 5 seconds (adjust the interval as needed)
}


function storePointsInFirebase(points) {
    // Get a reference to the user's points in Firebase
    const pointToDatabase = database.ref('users/' + userId + '/points');

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

        // console.log('Points stored in Firebase:', updatedPoints);
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
    // console.log('Points stored in Firebase: ' + currentPoints);

    const claimPoints = new bootstrap.Modal(document.getElementById('claimPoints'));
    claimPoints.show();
    

});

// Initialize the points display and start the update interval
getCurrentPoints();
updatePointsInterval();
// POINT SYSTEM FEATURE END


// CHANGE BACKGROUND FEATURE START
var currentImageIndex = 0; // Initialize the current image index
var imagePaths = ["clouds.jpg","landscape.jpg", "sailboat.jpg","NatureBG1.jpg","NatureBG2.jpg"]; // Replace with your image paths


function changeBackgroundImage() {
  // Select the div with id "studyBG"
  //var studyBGDiv = document.getElementById("studyBG");
  var bodytest = document.body;

  // Fetch the next image URL from Firebase Storage
  storage
    .ref("imagebackground/" + imagePaths[currentImageIndex])
    .getDownloadURL()
    .then(function (url) {
      // Set the background image to the fetched image URL
    //   studyBGDiv.style.backgroundImage = "url(" + url + ")";
      bodytest.style.backgroundImage = "url(" + url + ")";
      bodytest.style.backgroundSize = "cover"
      bodytest.style.backgroundRepeat = "no-repeat"
    })
    .catch(function (error) {
      console.error("Error fetching image URL:", error);
    });

  // Increment the current image index or reset it to 0 if it reaches the end
  currentImageIndex = (currentImageIndex + 1) % imagePaths.length;

  //only thing is the firebase image is fetch randomly
}
// CHANGE BACKGROUND FEATURE END


// Call checkAndEnableButtons initially to set the initial button state

function checkAndEnableButtons() {
    if (userId) {
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

let input = document.getElementById('input')
input.addEventListener("keyup", function(event){
    if (event.key === "Enter") {
        if (input.value != "") { //this is to prevent them from mistyping enter key and have many blank todo list
        saveTodoList();
        }
    }
}) 

function saveTodoList() {
    const todo = document.getElementById('input').value;
    
    if (!userId) {
        // The user is not signed in; handle this case accordingly
        window.location.href = 'home.html';
        return;
    }

    // Ensure the user is signed in before adding a note
    const userNotesRef = database.ref('users/' + userId + '/todo');

    // Push the note data to the user's notes in the Firebase database
    const newNoteRef = userNotesRef.push();
    newNoteRef.set({
        todo: todo,
        
    });

    // Clear the input fields after saving
    document.getElementById('input').value = '';
    

    // Optionally, you can add a success message or perform any other action
//   console.log("Note saved successfully")
}

function displayUserTodoList(uid) {
    const display = document.getElementById('display');
    const todoInput = document.getElementById('input');
    let count = 0;
    

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
            deleteButton.className = 'deleteButton';
      

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

    const confirmed = new bootstrap.Modal(document.getElementById('delete'));
    confirmed.show();

    if(confirmed){
        userNotesRef.child(noteId).remove();
    }

}

// Function to clear all to-do items from the user's to-do list
function clearToDoList(userId) {
    const userToDoListRef = database.ref('users/' + userId + '/todo');

   
    const confirmed = new bootstrap.Modal(document.getElementById('delete'));
    confirmed.show();
    
    if(confirmed){
        userToDoListRef.remove();
    }
}

// Add an event listener to the "Clear List" button
const clearButton = document.getElementById('clearButton');

clearButton.addEventListener('click', () => {
    if (userId) {
        clearToDoList(userId);
    } else {
        
        console.log("user needs to sign in to do this action")
    }
});


var moodDataArray = []; // This array will store mood data objects

var moodChart; // Declare moodChart as a global variable

function recordMood(mood) {
    // console.log(mood);
    // Get the current user 
    if (userId) {
        const userMoodRef = database.ref("users/" + userId + "/mood");

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
                        existingMoods.normal = (existingMoods.normal ||0) + 1;
                    } else if (mood === 3) {
                        existingMoods.sad = (existingMoods.sad || 0) + 1;
                    }

                    // Update the existing entry with the new mood values
                    userMoodRef.child(dateString).update(existingMoods).then(() => {
                        console.log('Mood updated successfully:', existingMoods);
                        const recordModal = new bootstrap.Modal(document.getElementById('recordModal'));
                        recordModal.show();

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
                        newMoodEntry.normal = 1;
                    } else if (mood === 3) {
                        newMoodEntry.sad = 1;
                    }

                    userMoodRef.child(dateString).set(newMoodEntry).then(() => {
                        // console.log('Mood recorded successfully:', newMoodEntry);
                        
                        const recordModal = new bootstrap.Modal(document.getElementById('recordModal'));
                        recordModal.show();
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
});


// USER GUIDE START
 var userGuidance = document.getElementById('userGuidance');


function guide(){
    
    userGuidance.addEventListener('click', function() {
        const test = new bootstrap.Modal(document.getElementById('userGuide'));
        test.show();
    } )

  
}
// USER GUIDE END








