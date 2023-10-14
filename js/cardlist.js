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

const purchasedImageUrls = [];
//console.log(purchasedImageUrls)
let userId; // User ID


// Add a user authentication state change listener
auth.onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in
        userId = user.uid;
        //fetch function may not be needed, its used to check the points
        //fetchPointsFromDatabase();
        getUserImageUrlData();
        createImageContainers();
        displayPoint()
    } else {
        // User is signed out
        userId = null;
    }
});
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

const userCurrentImages = []; // Create an empty array to store user's current images
console.log(userCurrentImages)
function getUserImageUrlData() {
    // Check if userId is defined
    if (!userId) {
        console.error('userId is not defined');
        return;
    }

    
    const userImagesRef = database.ref('users/' + userId + '/purchasedImages');

    // Fetch all images from the user's purchased images
    userImagesRef.once('value')
        .then(function(snapshot) {
            const imageUrls = snapshot.val();
            
            // Check if there are any images
            if (imageUrls) {
                // Iterate through the image URLs and add them to the userCurrentImages array
                Object.values(imageUrls).forEach(function(imageUrl) {
                    userCurrentImages.push(imageUrl);
                });
            }

            // Now, the userCurrentImages array contains all the user's purchased images
            console.log('User\'s current images:', userCurrentImages);
        })
        .catch(function(error) {
            console.error('Error fetching user images:', error);
        });
}

const imageData = [
    { imageName: 'hiker1.jpg', points: 10 },
    { imageName: 'hiker2.jpg', points: 30 },
    { imageName: 'hiker3.jpg', points: 150 },
    { imageName: 'hiker4.jpg', points: 30 },
    { imageName: 'dark1.jpg', points: 350 },
    { imageName: 'dark2.jpg', points: 330 },
    { imageName: 'dark3.jpg', points: 320 },
    { imageName: 'dark4.jpg', points: 310 },
    { imageName: 'rabbit1.jpg', points: 130 },
    { imageName: 'rabbit2.jpg', points: 230 },
    { imageName: 'rabbit3.jpg', points: 330 },
    { imageName: 'rabbit4.jpg', points: 430 },
    // Add more objects for additional images and points as needed
];
//because everytime image is taken from firebase storage, its not in order so have to store the 
// url & points in the empty array and from there display it
const imageUrls = []; // Create an empty array to store image URLs

const imageContainer = document.getElementById('imageContainer');

// Function to create and append image containers
function createImageContainers() {
    // Sort imageData based on points in descending order
    imageData.sort((a, b) => b.points - a.points);

    imageData.forEach((imageInfo) => {
        const imageName = imageInfo.imageName;
        const points = imageInfo.points;

        // Get a reference to the image in Firebase Storage
        const imageRef = storage.ref().child('images/' + imageName);

        // Get the download URL for the image
        imageRef.getDownloadURL().then(function(url) {
            // Store the image URL in the array
            imageUrls.push({ url, points });

            // Check if all URLs have been collected
            if (imageUrls.length === imageData.length) {
                // Sort the image URLs based on points
                imageUrls.sort((a, b) => b.points - a.points);

                // Create and append image containers in the sorted order
                imageUrls.forEach((imageUrlInfo) => {
                    const url = imageUrlInfo.url;
                    const points = imageUrlInfo.points;

                    // Create a <div> element to hold the image and points
                    const divContainer = document.createElement('div');
                    
                    const imgElement = document.createElement('img');
                    const pointsElement = document.createElement('p');

                    pointsElement.textContent = points + ' points';
                    divContainer.classList.add('ImageWithPoints')
                    imgElement.classList.add('SpecialImage');
                    imgElement.src = url;

                    // Append the <img> and points elements to the <div> container
                    
                    divContainer.appendChild(imgElement);
                    divContainer.appendChild(pointsElement);

                    // Append the <div> container to the imageContainer
                    imageContainer.appendChild(divContainer);

                    // Add a click event listener to the <div> container
                    divContainer.addEventListener('click', function() {
                        // Check if the URL already exists in purchasedImageUrls
                        if (purchasedImageUrls.includes(url) || userCurrentImages.includes(url)) {
                            alert('You already purchased this image.');
                        } else {
                            // Attempt to exchange points when the user clicks on the image
                            var userPointsRef = database.ref('users/' + userId + '/points');
                    
                            userPointsRef.once('value').then(function(snapshot) {
                                var userPoints = snapshot.val();
                    
                                if (userPoints !== null && !isNaN(userPoints.Points)) {
                                    var exchangeSuccessful = exchangePoints(userPoints.Points, points);
                    
                                    if (exchangeSuccessful) {
                                        // Deduct the points in the database
                                        alert('YOU BOUGHT IT');
                                        var updatedPoints = userPoints.Points - points;
                    
                                        userPointsRef.set({ Points: updatedPoints }, function(error) {
                                            if (error) {
                                                console.error('Error deducting points from the database:', error);
                                            } else {
                                                console.log('Points deducted successfully. New user points:', updatedPoints);
                    
                                                // Add the purchased image URL to the user's database record
                                                addImageToUserDatabase(url);
                                            }
                                        });
                                    } else {
                                        alert('Not enough points to exchange.');
                                    }
                                } else {
                                    console.error('Invalid userPoints value:', userPoints);
                                }
                            }).catch(function(error) {
                                console.error('Error fetching user points:', error);
                            });
                        }
                    });
                    
                });
            }
        });
    });
}



function exchangePoints(userPoints, imagePoints) {
    if (userPoints >= imagePoints) {
        //updatePointsDisplay();
        return true; // Point exchange successful
    } else {
        return false; // Not enough points
    }
}


function addImageToUserDatabase(imageUrl) {
    if (userId) {
        console.log('Adding image to user database - userId:', userId, 'imageUrl:', imageUrl);

        // Define the path to the user's data in the database (customize this)
        const userRef = database.ref('users/' + userId);

        // Update the user's data with the purchased image URL
        userRef.child('purchasedImages').push(imageUrl, function(error) {
            if (error) {
                console.error('Error adding image to user database:', error);
            } else {
                console.log('Image added to user database successfully.');
                purchasedImageUrls.push(imageUrl);
            }
        });
    } else {
        console.error('userId is undefined.');
    }
}

// function fetchPointsFromDatabase() {
//     if (userId) {
//         // Reference to the user's points in the database
//         const userPointsRef = database.ref('users/' + userId + '/points');

//         // Retrieve the points from the database
//         userPointsRef.once('value').then(function(snapshot) {
//             const userData = snapshot.val();
//             if (userData && userData.Points !== undefined && userData.Points !== null) {
//                 const points = userData.Points;
//                 // Now, you have the points in the "points" variable
//                 console.log('Pointssss from the database:', points);
//             } else {
//                 // Handle the case where there are no points in the database
//                 console.log('No points found in the database.');
//             }
//         }).catch(function(error) {
//             // Handle any errors that may occur during the retrieval
//             console.error('Error fetching points:', error);
//         });
//     } else {
//         console.error('User is not authenticated.');
//     }
// }

//when the user first load this page, i will call this function in auth to display current points
function displayPoint() {
    if (!userId) {
        // Handle the case where userId is not defined
        console.error('userId is not defined');
        return;
    }
    const pointsRef = database.ref('users/' + userId + '/points');
    const span = document.getElementById('pointsSpan');

    // Listen for changes to the user's points in real-time
    pointsRef.on('value', function(snapshot) {
        const pointvalue = snapshot.val();
        
        // Check if pointvalue is an object with a 'Points' property
        if (typeof pointvalue === 'object' && 'Points' in pointvalue) {
            const numericValue = pointvalue.Points;
            span.textContent = numericValue.toString(); // Display the numeric value as a string
        } else {
            span.textContent = pointvalue.toString(); // Display the value as a string
        }
    }, function(error) {
        // Handle any errors that occur while listening for changes
        console.error('Error listening for user points:', error);
    });
}





