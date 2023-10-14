// Your web app's Firebase configuration
var firebaseConfig = {
  // put your api stuff here
  apiKey: "AIzaSyCT4ilVsx9OHQwazEKXgPyHaV1wus6e_Ik",
  authDomain: "test1-69744.firebaseapp.com",
  databaseURL: "https://test1-69744-default-rtdb.asia-southeast1.firebasedatabase.app/",
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

// Set up our register function
function register() {
  // Get all our input fields
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const full_name = document.getElementById('full_name').value;

  // Get the selected gender
  let gender;
  const genderRadios = document.getElementsByName('gender');
  for (let i = 0; i < genderRadios.length; i++) {
    if (genderRadios[i].checked) {
      gender = genderRadios[i].value;
      break;
    }
  }

  // Validate input fields
  if (validate_email(email) == false || validate_password(password) == false) {
    alert('Email or Password is Outta Line!!');
    //display fail box
    var invalidAlert = document.getElementById('invalid-alert');
    invalidAlert.style.display = 'block';
    return;
    // Don't continue running the code
  }

  if (validate_field(email) == false || validate_field(password) == false) {
    //display fail box
    var emptyAlert = document.getElementById('fail-alert');
    emptyAlert.style.display = 'block';
    return;
    // Don't continue running the code


  }

  // Move on with Auth
  auth.createUserWithEmailAndPassword(email, password)
    .then(function () {
      // Declare user variable
      var user = auth.currentUser;

      // Add this user to Firebase Database
      var database_ref = database.ref();

      // Create User data
      var user_data = {
        email: email,
        full_name: full_name,
        gender: gender, // Store the selected gender
        last_login: Date.now()
      };

      // Push to Firebase Database
      return database_ref.child('users/' + user.uid).set(user_data);
    })
    .then(function () {

      //display alert box

      var successAlert = document.getElementById('success-alert');
      successAlert.style.display = 'block';
           //set interval so that user can see the alert before directing to the next page
      setInterval(function(){
            window.location.href = "home.html",4000
          })
    })
    .catch(function (error) {
      // Firebase will use this to alert of its errors
      var error_code = error.code;
      var error_message = error.message;

      alert(error_message);
    });
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