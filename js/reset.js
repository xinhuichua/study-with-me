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

  firebase.initializeApp(firebaseConfig);


const mailField = document.getElementById('mail');
const labels = document.getElementsByTagName('label');
const resetPassword = document.getElementById('resetPassword');


const auth = firebase.auth();

//auth.languageCode = 'DE_de';

auth.useDeviceLanguage();

var form = document.getElementsByTagName("form")[0];
// Execute a function when the user presses a key on the keyboard
form.addEventListener("keydown", function(event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Trigger the button element with a click
    resetPassword.click();
    console.log('enter')
  }
});

const resetPasswordFunction = () => {

    const email = mailField.value;

    auth.sendPasswordResetEmail(email)
    .then(() => {
        console.log('Password Reset Email Sent Successfully!');
        var success = new bootstrap.Modal(document.getElementById('success'));
        success.show();
    })
    .catch(error => {
        console.error(error);
        var failure = new bootstrap.Modal(document.getElementById('failure'));
        failure.show();
    })
}


// resetPassword.addEventListener('click', resetPasswordFunction);

//Animations
mailField.addEventListener('focus', () => {
    labels.item(0).className = "focused-field";
});

mailField.addEventListener('blur', () => {
    if(!mailField.value)
        labels.item(0).className = "unfocused-field";
});