// Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCT4ilVsx9OHQwazEKXgPyHaV1wus6e_Ik",
    authDomain: "test1-69744.firebaseapp.com",
    databaseURL: "https://test1-69744-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "test1-69744",
    storageBucket: "test1-69744.appspot.com",
    messagingSenderId: "587694443578",
    appId: "1:587694443578:web:f0123996bd6f63ed8ef903",
    measurementId: "G-0LBGW6RB64"
  };

firebase.initializeApp(firebaseConfig);

// Initialize Firebase database reference
const database = firebase.database();

const auth = firebase.auth();
let currentUser; // To store the current user's information

firebase.auth().onAuthStateChanged((user) => { //check whether user login - user ID and details
    if (user) {
        // User is signed in
        currentUser = user;

        // dislay usernotes based on userid
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
      //  currentUser = null;
        window.location = 'home.html'; //If User is not logged in, redirect to home page
    }
});

function modal(){
    const noteUpdate = new bootstrap.Modal(document.getElementById('updateNotess'));
    noteUpdate.show();
}

//-------------Note function-------------------------
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
                
                    const noteId = childSnapshot.key;
                    userNotesRef.child(noteId).update({
                        body: body,
                        timestamp: firebase.database.ServerValue.TIMESTAMP,
                    });

                   //success message
                    console.log('Note updated successfully!');
                    // modal()
                    const noteUpdate = new bootstrap.Modal(document.getElementById('updateNotes'));
                    noteUpdate.show();
                  
                
            } else {
                // Note with the given title does not exist, handle accordingly
              console.log('Note not found for update.');
            }
        });
    } else {
        // The user is not signed in; you may want to handle this case accordingly
        console.log('You need to sign in to update a note.');
    }
}



// save note
function saveNote() {
    const title = document.getElementById('noteTitle').value;
    const body = document.getElementById('noteBody').value;



    if (!currentUser) {
        // The user is not signed in; handle this case accordingly
        console.log('You need to sign in to add a note.');
        return;
    }

    if (title.trim() === '' || body.trim() === '') {
        // Handle the case where either the title or body is empty
        console.log('Please enter both a title and a body for the note.');
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

   
    console.log('Note saved successfully!');
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
        
         
            //event listener for deletebutton
            deleteButton.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent the click event from propagating to the note container
                deleteNoteFromDatabase(uid, noteId);
            });

            // display only title in the note list
            const summaryView = document.createElement('div');
            summaryView.className = 'notes__summary-view';
            summaryView.textContent = note.title; // You can customize the summary view as needed

            // Append the summarView consiting of note title and delete button to the note container
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

    // Show the Bootstrap modal
    const deleteConfirmationModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
    deleteConfirmationModal.show();

   
    // Attach an event listener to the "Delete" button in the modal to perform the deletion
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    if (confirmDeleteButton) {
        confirmDeleteButton.addEventListener('click', () => {
            //remove notes based on noteid
            userNotesRef.child(noteId).remove();
    
            // Close the modal after deletion
            deleteConfirmationModal.hide();
        });
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

    console.log("change font")
}


  


// search function
function searchNotes(query) {
    // Get the notes list container
    const notesList = document.getElementById('notesList');

    // Get all note containers within the list
    const noteContainers = notesList.getElementsByClassName('notes__list-item');

    //ensure text is in lowercase before searching
    const lowercaseQuery = query.toLowerCase();

    // Loop through each note container and check if it contains the search query
    for (const noteContainer of noteContainers) {
       
        const summaryView = noteContainer.querySelector('.notes__summary-view');

        // Get the delete button image within the container
        const deleteButton = noteContainer.querySelector('img[alt="Delete Note"]');

        // If the summary view text contains the search query, show the note; otherwise, hide it
        if (summaryView.textContent.toLowerCase().includes(lowercaseQuery)) {
            noteContainer.style.display = 'block';
        } else {
            noteContainer.style.display = 'none';
        }
    }
}

//justify notes content

function setJustify(justify) {
    const textElement = document.getElementById('noteBody');
    textElement.style.textAlign = justify;


  }
  




