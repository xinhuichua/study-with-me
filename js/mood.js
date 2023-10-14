//Record mood
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