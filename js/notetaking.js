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


  // Add the new rule for allowing read and write access to all authenticated users (for login register rule)
  //".read": "auth != null",
  //".write": "auth != null"


  // Initialize Firebase with your configuration

firebase.initializeApp(firebaseConfig);

// Initialize Firebase database reference
const database = firebase.database();

const auth = firebase.auth();
let currentUser; // To store the current user's information

auth.onAuthStateChanged((user) => { //check whether user login - user ID and details
    if (user) {
        // User is signed in
        currentUser = user;

        // Call a function to display the user's notes
        displayUserNotes(user.uid);

        // Attach a click event handler to the logout button
        logoutButton.addEventListener('click', () => {
        // Sign the user out
        auth.signOut().then(() => {
          // Redirect the user to the login page after logout
          window.location.href = 'home.html'; // Replace with the actual login page URL
        }).catch((error) => {
          // Handle any errors that occur during sign-out
          console.error('Error signing out:', error);
        });
      });


    } else {
        // User is signed out
        currentUser = null;
    }
});

// ... Your existing code ...

// Function to update a note's content
function updateNote() {
    const title = document.getElementById('noteTitle').value;
    const body = document.getElementById('noteBody').value;

    if (currentUser) {
        // Ensure the user is signed in before updating a note
        const userNotesRef = database.ref('users/' + currentUser.uid + '/notes');

        // Find the selected note by its title and update its content
        userNotesRef.orderByChild('title').equalTo(title).once('value', (snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    const noteId = childSnapshot.key;
                    userNotesRef.child(noteId).update({
                        body: body,
                        timestamp: firebase.database.ServerValue.TIMESTAMP,
                    });

                    // Optionally, you can add a success message or perform any other action
                    alert('Note updated successfully!');
                });
            } else {
                // Note with the given title does not exist, handle accordingly
                alert('Note not found for update.');
            }
        });
    } else {
        // The user is not signed in; you may want to handle this case accordingly
        alert('You need to sign in to update a note.');
    }
}

// ... Your existing code ...


function addNote() {
    // Clear the input fields
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteBody').value = '';

    // Focus on the title field
    document.getElementById('noteTitle').focus();
}


// Function to add a new note for the current user
function saveNote() {
    const title = document.getElementById('noteTitle').value;
    const body = document.getElementById('noteBody').value;

    if (!currentUser) {
        // The user is not signed in; handle this case accordingly
        alert('You need to sign in to add a note.');
        return;
    }

    if (title.trim() === '' || body.trim() === '') {
        // Handle the case where either the title or body is empty
        alert('Please enter both a title and a body for the note.');
        return;
    }

    // Ensure the user is signed in before adding a note
    const userNotesRef = database.ref('users/' + currentUser.uid + '/notes');

    // Push the note data to the user's notes in the Firebase database
    const newNoteRef = userNotesRef.push();
    newNoteRef.set({
        title: title,
        body: body,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
    });

    // Clear the input fields after saving
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteBody').value = '';

    // Optionally, you can add a success message or perform any other action
    alert('Note saved successfully!');
}



// Function to retrieve and display notes for the current user
function displayUserNotes(uid) {
    const notesList = document.getElementById('notesList');
    const previewTitle = document.getElementById('noteTitle');
    const previewBody = document.getElementById('noteBody');

    // Reference to the user's notes in the database
    const userNotesRef = database.ref('users/' + uid + '/notes');

    // Listen for changes to the user's notes
    userNotesRef.on('value', (snapshot) => {
        notesList.innerHTML = ''; // Clear the existing notes

        // Loop through each note in the user's notes
        snapshot.forEach((childSnapshot) => {
            const note = childSnapshot.val();
            const noteId = childSnapshot.key;

            // Create a container for each note
            const noteContainer = document.createElement('div');
            noteContainer.className = 'notes__list-item';

            // Add a click event listener to each note container
            noteContainer.addEventListener('click', () => {
                // Display the clicked note in the preview area
                previewTitle.value = note.title;
                previewBody.value = note.body;
            });

            // Create a delete button for the note

             const deleteButton = document.createElement('img');
            deleteButton.setAttribute('src', '../img/delete.png');
            deleteButton.setAttribute('width', '20px');
           

            // Add a click event listener to the delete button
            deleteButton.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent the click event from propagating to the note container
                deleteNoteFromDatabase(uid, noteId);
            });

            // Create a summary view for the note (e.g., only title)
            const summaryView = document.createElement('div');
            summaryView.className = 'notes__summary-view';
            summaryView.textContent = note.title; // You can customize the summary view as needed

            // Append the summary view and delete button to the note container
            noteContainer.appendChild(summaryView);
            noteContainer.appendChild(deleteButton);

            // Append the note container to the notes list
            notesList.appendChild(noteContainer);
        });
    });
}

// Function to delete a note from the user's notes in the database
function deleteNoteFromDatabase(uid, noteId) {
    const userNotesRef = database.ref('users/' + uid + '/notes');

    const confirmed = window.confirm("Are you sure you want to delete?")

    if(confirmed){
        userNotesRef.child(noteId).remove();
    }

}

// Function to change the font family of note preview
function changeFontFamily() {
    const fontSelector = document.getElementById('fontSelector');
    const selectedFont = fontSelector.value;

    // Apply the selected font family to the note preview area
    const previewTitle = document.getElementById('noteTitle');
    const previewBody = document.getElementById('noteBody');
    previewTitle.style.fontFamily = selectedFont;
    previewBody.style.fontFamily = selectedFont;
}









