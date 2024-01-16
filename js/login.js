// Your web app's Firebase configuration
var firebaseConfig = {
  // put your api stuff here
  apiKey: "YOUR_API_KEY",
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

var form = document.getElementsByTagName("form")[0];
// Execute a function when the user presses a key on the keyboard
form.addEventListener("keydown", function(event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Trigger the button element with a click
    document.getElementById("loginBtn").click();
  }
});

// login function
function login() {
  
  email = document.getElementById('email').value
  password = document.getElementById('password').value
  var loginBtn = document.getElementById('loginBtn');

  // Validate input fields
  if (validate_email(email) == false || validate_password(password) == false) {
    const modalBody = document.querySelector('#errorModal .modal-body');
    
      
    modalBody.innerText = "Please fill in all blanks"
  

    const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
    errorModal.show();
    return
   
  }

  auth.signInWithEmailAndPassword(email, password)
    .then(function () {
      // Declare user variable
      var user = auth.currentUser

      // Add this user to Firebase Database
      var database_ref = database.ref()

      // Create User data
      var user_data = {
        last_login: Date.now()
      }

      // Push to Firebase Database
      database_ref.child('users/' + user.uid).update(user_data)

      //display alert box
      const successBody = document.querySelector('#successModal .modal-body');

      successBody.innerText = "Login success";
      
      const successModal = new bootstrap.Modal(document.getElementById('successModal'));
      successModal.show();

      //set interval so that user can see the alert before directing to the next page
      setInterval(function(){
        window.location.href = "main-page.html",4000
      })
     

    })
    .catch(function (error) {
      // Firebase will use this to alert of its errors
      var error_code = error.code
      var error_message = error.message

      console.log(error_code)
      console.log(error_message)

      //display fail box
      if(error_code == 'auth/internal-error'){
        const modalBody = document.querySelector('#errorModal .modal-body');
      
        
        modalBody.innerText = "Incorrect password or email. Please try again";
      
  
        const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
        errorModal.show();
  
       }
     
    })
}




// Validate Functions
function validate_email(email) {
  expression = /^[^@]+@\w+(\.\w+)+\w$/
  if (expression.test(email) == true) {
    // Email is good
    return true
  } else {
    // Email is not good
    return false
  }
}

function validate_password(password) {
  // Firebase only accepts lengths greater than 6
  if (password < 6) {
    return false
  } else {
    return true
  }
}

function validate_field(field) {
  if (field == null) {
    return false
  }

  if (field.length <= 0) {
    return false
  } else {
    return true
  }
}
