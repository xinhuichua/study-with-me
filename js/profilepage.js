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
  

// Initialize Firebase with your Firebase configuration
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const storage = firebase.storage();
const database = firebase.database();


let userId; // User ID

// Add a user authentication state change listener
auth.onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in
        userId = user.uid;
        username()
        displayPurchasedImages(userId);
        displayMoodEmoji();


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

    } else {
        // User is signed out
        userId = null;
    }
});

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
            span.textContent = "UNKNOWN USERNAME"
        }
    }, function(error){
        console.error('Error listening for user full name:', error)
    }
    )
}

// Function to retrieve and display purchased images
function displayPurchasedImages(userId) {
    // Reference to the user's purchased images in the database
    const userImagesRef = database.ref('users/' + userId + '/purchasedImages');

    userImagesRef.on('value', (snapshot) => {
        const imageContainer = document.getElementById('imageContainer');
        
        // Create an array to collect images
        const imagesArray = [];

        snapshot.forEach((childSnapshot) => {
            const images = childSnapshot.val();

            const url = images.imageUrl;
            const cardName = images.cardNameElement;
            const cardPoints = images.points;

            imagesArray.push({ url, cardName, cardPoints });
        });

        // Sort the array based on points in descending order
        imagesArray.sort((a, b) => b.cardPoints - a.cardPoints);

        imagesArray.forEach((imageInfo) => {
            const { url, cardName, cardPoints } = imageInfo;

            let divCardContainer = document.createElement('div');
            divCardContainer.classList.add('card', 'col-lg-3', 'col-md-6', 'col-sm-12', 'm-3', 'divBackgroundDesign');
            divCardContainer.setAttribute('style', 'display:inline-block; width:12rem');

            let cardImageElement = document.createElement('img');
            cardImageElement.src = url;
            cardImageElement.classList.add('card-img-top');

            // const cardLabelDiv = document.createElement('div');
            // cardLabelDiv.classList.add('card-body');

            let cardNameElement = document.createElement('p');
            cardNameElement.className = 'card-title';
            cardNameElement.textContent = cardName;

            let pointsElement = document.createElement('p');
            pointsElement.textContent = cardPoints +" points";

            divCardContainer.appendChild(cardNameElement);
            divCardContainer.appendChild(cardImageElement);
            divCardContainer.appendChild(pointsElement)
            

            // Append the image container to the document's DOM
            imageContainer.appendChild(divCardContainer);

            //call a function to count the array of object to track how many cards the user bought
            displayImagesCount(imagesArray)
        });
    });
}

function displayImagesCount(imagesArray) {
    
    const test = imagesArray.length;
    var cardCount = document.getElementById('cardCount');
    cardCount.textContent = test
}



const moodDataArray = [];

function displayMoodEmoji() {
    // Check if currentUser is defined
    if (userId) {
        // Replace 'currentUser.uid' with the actual user's UID
        const userMoodRef = database.ref("users/" + userId + "/mood");

        // Query the mood data, assuming you want all mood entries
        userMoodRef.orderByChild('timestamp').once('value')
            .then(function (snapshot) {
                const moodData = snapshot.val();

                if (moodData) {
                    // Iterate through mood entries and add them to the moodDataArray
                    Object.keys(moodData).forEach(function (key) {
                        const moodEntry = moodData[key];
                        moodDataArray.push(moodEntry);
                    });

                    // Now you have all mood data in the moodDataArray
                    console.log('Mood data:', moodDataArray);
                    
                    // Call the function to group and display emojis
                    groupAndDisplayEmojis();
                } else {
                    // Handle the case when there is no mood data
                    console.log('No mood data found.');
                }
            })
            .catch(function (error) {
                // Handle any errors that occur while fetching the data
                console.error('Error fetching mood data:', error);
            });
    } else {
        console.log('currentUser is not defined.');
    }
}

// Function to group and display emojis by day/month
function convertToEmoji(text) {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = text;
    return tempElement.textContent;
}


// Function to group and display emojis by month
function groupAndDisplayEmojis() {
    const emojiContainer = document.getElementById('emoji-container');

    // Create a map to group emojis by month
    const emojiGroups = new Map();

    moodDataArray.forEach((moodEntry) => {
        const timestamp = moodEntry.timestamp; // Assuming timestamp is in milliseconds
        const mood = moodEntry.mood;

        // Create a Date object from the timestamp
        const date = new Date(timestamp);

        // Extract year and month information
        const year = date.getFullYear();
        const month = date.toLocaleString('default', { month: 'long' }); // Get full month name

        // Create a unique key for grouping (e.g., "January 2023")
        const groupKey = `${month} ${year}`;

        // Create an emoji element
        const emojiElement = document.createElement('span');
        emojiElement.textContent = convertToEmoji(mood);
        emojiElement.className = 'emoji';

        // Check if the group key already exists in the map
        if (emojiGroups.has(groupKey)) {
            // If it exists, append the emoji below the month
            emojiGroups.get(groupKey).appendChild(emojiElement);
        } else {
            // If it doesn't exist, create a new group div
            const groupDiv = document.createElement('div');
            groupDiv.className = 'emoji-group';
            groupDiv.innerHTML = `<strong>${groupKey}:</strong><br>`; // Display month above emojis
            groupDiv.appendChild(emojiElement);
            emojiGroups.set(groupKey, groupDiv);
        }
    });

    // Append all group divs to the emoji container
    emojiGroups.forEach((groupDiv) => {
        emojiContainer.appendChild(groupDiv);
    });
}

// Call the function to group and display emojis
groupAndDisplayEmojis();


