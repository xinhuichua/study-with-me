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

const userCurrentImages = []; // Create an empty array to store user's current images
//console.log(userCurrentImages)

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
        window.location = 'home.html'; //If User is not logged in, redirect to home page
    }
});
logoutButton.addEventListener('click', () => {
    // Sign the user out
    auth.signOut().then(() => {

          // Show the Bootstrap modal
      const logoutModal = new bootstrap.Modal(document.getElementById('logoutModal'));
      logoutModal.show();
     
      setInterval(function(){
        window.location.href = "home.html",8000
      })
    
      
    }).catch((error) => {
      // Handle any errors that occur during sign-out
      console.error('Error signing out:', error);
    });
  });




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

        })
        .catch(function(error) {
            console.error('Error fetching user images:', error);
        });
}

const imageData = [
    { imageName: 'elephant.jpg', points: 10000 ,cardName: 'African Forest Elephant'},
    { imageName: 'leopard.jpg', points: 12000 ,cardName: 'Amur Leopard'},
    { imageName: 'rhino.jpg', points: 6000 ,cardName: 'Black Rhino'},
    { imageName: 'wildDog.jpg', points: 2000 ,cardName: 'African Wild Dog'},
    { imageName: 'monkey.jpg', points: 400 ,cardName: 'Black Spider Monkey'},
    { imageName: 'ferrets.jpg', points: 1800 ,cardName: 'Black-Footed Ferrets'},
    { imageName: 'blueWhale.jpg', points: 15000 ,cardName: 'Blue Whale'},
    { imageName: 'panda.jpg', points: 5000 ,cardName: 'Giant Panda'},
    { imageName: 'turtle.jpg', points: 1500 ,cardName: 'Hawksbill Turtle'},
    { imageName: 'dolphin.jpg', points: 7000 ,cardName: "Hector's Dolphin"},
    { imageName: 'butterfly.jpg', points: 500 ,cardName: 'Monarch Butterfly'},
    { imageName: 'gorrila.jpg', points: 4500 ,cardName: 'Mountain Gorilla'},
    { imageName: 'owl.jpg', points: 800 ,cardName: 'Northern Owl'},
    { imageName: 'redPanda.jpg', points: 5500 ,cardName: 'Red Panda'},
    { imageName: 'sealion.jpg', points: 4000 ,cardName: 'Sea Lion'},
    { imageName: 'tiger.jpg', points: 3500 ,cardName: 'Sunda Tiger'},
    { imageName: 'whaleShark.jpg', points: 8000 ,cardName: 'Whale Shark'},
    { imageName: 'yangtze.jpg', points: 1000 ,cardName: 'Yangtze Finless Porpoise'},
    
];

//because everytime image is taken from firebase storage, its not in order so have to store the 
// name, url & points in the empty array and from there display it
const imageUrls = []; // Create an empty array to store image URLs,cardname,points

const imageContainer = document.getElementById('imageContainer');

// Function to create and append image containers
function createImageContainers() {
    
    imageData.forEach((imageInfo) => {
        //point 1
        let imageFileName = imageInfo.imageName; //hiker1.jpg
        let cardPoints = imageInfo.points; //10
        let cardName = imageInfo.cardName; //hiker123
        
        // Get a reference to the image in Firebase Storage
        //point 1
        const imageRef = storage.ref().child('images/' + imageFileName); // getting the exact name of the file in the firebase storage

        // Get the download URL for the image
        imageRef.getDownloadURL().then(function(url) {
            //console.log(url)
            // Store the image URL in the array
            imageUrls.push({ url, cardPoints, cardName }); // referring to point 1
            
            // Check if all URLs have been collected
            // imageUrls = [{url:'',cardPoints:10,cardName:'hiker'}]
            if (imageUrls.length === imageData.length) {
                //console.log(imageUrls)
                //Sort the image URLs based on points
                imageUrls.sort((a, b) => b.cardPoints - a.cardPoints);

                // Create and append image containers in the sorted order
                imageUrls.forEach((imageUrlInfo) => { //looping through the array of objects
                    let url = imageUrlInfo.url; 
                    let points = imageUrlInfo.cardPoints;
                    let cardName = imageUrlInfo.cardName;

                    // Create a <div> element to hold the image, card name, and points
                    let divCardContainer = document.createElement('div');
                    divCardContainer.classList.add('card', 'col-lg-3', 'col-md-6', 'col-sm-12', 'm-3', 'divBackgroundDesign');
                    divCardContainer.setAttribute('style', 'display:inline-block; width:12rem');
                 

                    let cardNameElement = document.createElement('p');
                    cardNameElement.className = 'card-title';
                    cardNameElement.setAttribute('style', "font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif; font-size:17px; padding-top: 10px; margin: 0px");
                    let cardImageElement = document.createElement('img');
                    let pointsElement = document.createElement('p');
                    pointsElement.setAttribute('style', "font-family: monospace; margin-bottom:10px");

                    // Card Name
                    cardNameElement.textContent = cardName; 
                    // Image Element
                    cardImageElement.classList.add('SpecialImage');
                    cardImageElement.src = url;
                    // Points
                    pointsElement.textContent = points + ' points';
                
                    // Append the Card Name, Image Element, Points to the <div> container
                    divCardContainer.appendChild(cardNameElement);
                    divCardContainer.appendChild(cardImageElement);
                    divCardContainer.appendChild(pointsElement);

                    // Append the <div> container to the imageContainer
                    imageContainer.appendChild(divCardContainer);

                   

                    // Add a click event listener to the <div> container
                    divCardContainer.addEventListener('click', function() {
                        // Check if the URL already exists in purchasedImageUrls & userCurrentImages
                        if (
                            purchasedImageUrls.some((userImage) => userImage.imageUrl == url) ||
                            userCurrentImages.some((userImage) => userImage.imageUrl == url)
                        ) {
                            //https://getbootstrap.com/docs/5.0/components/modal/
                            var CardPurchaseStatus = new bootstrap.Modal(document.getElementById('CardPurchaseStatus'));
                            CardPurchaseStatus.show();
                  
                        }else {
                            // Attempt to exchange points when the user clicks on the image
                            var userPointsRef = database.ref('users/' + userId + '/points');
                    
                            userPointsRef.once('value').then(function(snapshot) {
                                var userPoints = snapshot.val();
                    
                                if (userPoints !== null && !isNaN(userPoints.Points)) {
                                    var exchangeSuccessful = exchangePoints(userPoints.Points, points);
                    
                                    if (exchangeSuccessful) {
                                        // Deduct the points in the database
                                        
                                        var CardBuying = new bootstrap.Modal(document.getElementById('CardBuying'));
                                        CardBuying.show();
                                        
                                        var updatedPoints = userPoints.Points - points;
                    
                                        userPointsRef.set({ Points: updatedPoints }, function(error) {
                                            if (error) {
                                                console.error('Error deducting points from the database:', error);
                                            } else {
                                                console.log('Points deducted successfully. New user points:', updatedPoints);
                                                
                                                // Add the purchased card content to the user's database record with this function
                                                addImageToUserDatabase(url, cardNameElement, points);
                                            }
                                        });
                                    } else {
                                        
                                        var CardPointsStatus = new bootstrap.Modal(document.getElementById('CardPointsStatus'));
                                        CardPointsStatus.show();
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
       
        return true; // Point exchange successful
    } else {
        return false; // Not enough points
    }
}


function addImageToUserDatabase(imageUrl, cardNameElement, points) {
    
    if (userId) {
        const imgNameText = cardNameElement.textContent;
        console.log('Adding image to user database - userId:', userId, 'imageUrl:', imageUrl, 'name:', imgNameText, 'cardpoint', points);

        
        const userRef = database.ref('users/' + userId);

        // Update the user's data with the purchased image URL and cardNameElement
        userRef.child('purchasedImages').push({
            imageUrl: imageUrl,
            cardNameElement: imgNameText,
            points: points
        }, function(error) {
            if (error) {
                console.error('Error adding image to user database:', error);
            } else {
                console.log('Image added to user database successfully.');
                purchasedImageUrls.push({ 
                    imageUrl: imageUrl, 
                    cardNameElement: imgNameText, 
                    points:points 
                });
            }
        });
    } else {
        console.error('userId is undefined.');
    }
}


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