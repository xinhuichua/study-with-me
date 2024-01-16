var category = 'success'
const API_KEY = 'YOUR_API_KEY'

axios.get('https://api.api-ninjas.com/v1/quotes', {
    params: { category: category },
    headers: { 'X-Api-Key': API_KEY }
})
    .then(response => {
        var data = response.data[0].quote
         document.getElementById('quote').innerText = data 
        
    })
    .catch(error => {
        console.error('Error: ', error.response.data);
    });
