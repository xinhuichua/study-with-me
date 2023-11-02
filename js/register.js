
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

var form = document.getElementsByTagName("form")[0];
// Execute a function when the user presses a key on the keyboard
form.addEventListener("keydown", function(event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Trigger the button element with a click
    document.getElementById("registerBtn").click();
  }
});

// Set up our register function
function register() {
  // Get all our input fields
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const username = document.getElementById('username').value;

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
    

    const modalBody = document.querySelector('#errorModal .modal-body');
    
      
    modalBody.innerText = "Please type in a valid email or key in a password with more than 6 characters" 

    const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
    errorModal.show();
    return;
   
  }

  if (validate_field(email) == false || validate_field(password) == false) {
    //display fail box
    const modalBody = document.querySelector('#errorModal .modal-body');
    
      
    modalBody.innerText = "Please fill in all the fields";
  

    const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
    errorModal.show();
    return;



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
        full_name: username,
        gender: gender, // Store the selected gender
        last_login: Date.now()
      };

      // Push to Firebase Database
      return database_ref.child('users/' + user.uid).set(user_data);
    })
    .then(function () {

      const successBody = document.querySelector('#successModal .modal-body');

      successBody.innerText = "Registration success";
      
      const successModal = new bootstrap.Modal(document.getElementById('successModal'));
      successModal.show();

      setInterval(function(){
            window.location.href = "/index.html",4000
          })
    })
    .catch(function (error) {
     
      var error_message = error.message;
      console.log(error_message);

     if(error_message != null){
      const modalBody = document.querySelector('#errorModal .modal-body');
    
      
      modalBody.innerText = error_message;
    

      const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
      errorModal.show();

     }

   
    });
}





// email validation - regular expression
function validate_email(email) {
  expression = /^[^@]+@\w+(\.\w+)+\w$/
  if (expression.test(email) == true) {
    
    return true
  } else {

    
    
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

//check if fields are empty
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