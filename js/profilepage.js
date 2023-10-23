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
        username();
        displayPurchasedImages(userId);

        if (userId) {
            fetchMoodDataForDates(userId, datesToFetch).then(() => {
                displayChart(userId);
            });
        } else {
            console.log('User ID is not defined.');
        }
        
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
//const imagesArray = [];
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




var testing12345 = []; // This array will store mood data objects
var moodChart; // Declare moodChart as a global variable

function displayChart(userId) {
    if (userId) {
        if (moodChart) {
            // Destroy the existing chart if it exists
            moodChart.destroy();
        }
        const moodData = moodDataArray;
        const labels = moodData.map(data => data.date);
        const happyData = moodData.map(data => data.happy);
        const sadData = moodData.map(data => data.sad);
        const angryData = moodData.map(data => data.angry);
        moodChart = new Chart("moodBarchart", {
            type: "bar",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Happy",
                        data: happyData,
                        backgroundColor: "green",
                    },
                    {
                        label: "Sad",
                        data: sadData,
                        backgroundColor: "blue",
                    },
                    {
                        label: "Angry",
                        data: angryData,
                        backgroundColor: "red",
                    },
                ],
            },
            options: {
                scales: {
                    x: {
                        beginAtZero: true,
                    },
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
    }
}



function fetchMoodDataForDates(userId, dates) {
    return new Promise((resolve, reject) => {
        if (userId) {
            var promises = dates.map(date => {
                const userMoodRef = database.ref("users/" + userId + "/mood/" + date);
                return userMoodRef.once("value")
                    .then(snapshot => {
                        if (snapshot.exists()) {
                            const moodData = snapshot.val();
                            const happy = moodData.happy || 0;
                            const sad = moodData.sad || 0;
                            const angry = moodData.angry || 0;
                            const moodDataObject = {
                                date: date,
                                happy: happy,
                                sad: sad,
                                angry: angry
                            };
                            // Update the existing data in the array or push new data
                            const existingDataIndex = moodDataArray.findIndex(item => item.date === date);
                            if (existingDataIndex !== -1) {
                                moodDataArray[existingDataIndex] = moodDataObject;
                            } else {
                                moodDataArray.push(moodDataObject);
                            }
                        } else {
                            console.log(`No mood data found for ${date}`);
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching mood data:', error);
                        reject(error);
                    });
            });

            // Wait for all promises to resolve before resolving the main Promise
            Promise.all(promises).then(() => {
                resolve();
            });
        }
    });
}

// Specify the dates you want to fetch
const datesToFetch = ["2023-10", "2023-11", "2023-12"];



