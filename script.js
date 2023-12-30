// Wait for the DOM to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', () => {
    // Load the current image of the day when the page loads
    getCurrentImageOfTheDay();
    // Load the search history when the page loads
    addSearchToHistory();

    // Event listener for the search form submission
    document.getElementById('search-form').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission behavior
        getImageOfTheDay(); // Fetch and display the image for the selected date
    });

    // Event listener for clicks on search history items
    document.getElementById('search-history').addEventListener('click', function (event) {
        if (event.target.tagName === 'LI') {
            // If a list item is clicked, get the date and fetch the image for that date
            const selectedDate = event.target.getAttribute('data-date');
            getImageOfTheDay(selectedDate);
        }
    });
});

// Replace 'YOUR_NASA_API_KEY' with your actual NASA API key
const API_KEY = 't2HPiilfJ2MYHb5Z7V6FZX9Ug5lDnM16QNBQMHSG';

// Function to fetch and display the current image of the day
function getCurrentImageOfTheDay() {
    const currentDate = new Date().toISOString().split("T")[0];
    getImageData(currentDate);
}

// Function to fetch and display the image of the day for a selected date
function getImageOfTheDay(date = null) {
    const searchDate = date || document.getElementById('search-input').value;
    if (!searchDate) return; // Do nothing if the date is not provided

    saveSearch(searchDate); // Save the search date to local storage
    getImageData(searchDate); // Fetch and display the image for the selected date
}

// Function to fetch data from the NASA APOD API
function getImageData(date) {
    const endpoint = `https://api.nasa.gov/planetary/apod?date=${date}&api_key=${API_KEY}`;

    fetch(endpoint)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch data from NASA API');
            }
            return response.json();
        })
        .then(data => {
            displayImage(data); // Display the fetched image data
        })
        .catch(error => {
            console.error(error.message);
            displayError(); // Display an error message in case of API request failure
        });
}

// Function to display the image in the UI
// ... (previous code)

// Function to display the image and information in the UI
function displayImage(data) {
    const container = document.getElementById('current-image-container');
    const image = document.createElement('img');
    image.src = data.url;
    image.alt = data.title;

    const infoContainer = document.createElement('div');
    infoContainer.id = 'image-info-container';

    const title = document.createElement('h2');
    title.textContent = data.title;

    const date = document.createElement('p');
    date.textContent = `Date: ${data.date}`;

    const explanation = document.createElement('p');
    explanation.textContent = data.explanation;

    // Clear existing content
    container.innerHTML = '';

    // Append image and information to the container
    container.appendChild(image);
    container.appendChild(infoContainer);
    infoContainer.appendChild(title);
    infoContainer.appendChild(date);
    infoContainer.appendChild(explanation);
}

// ... (previous code)


// Function to display an error message in case of API request failure
function displayError() {
    const container = document.getElementById('current-image-container');
    container.innerHTML = '<p>Error fetching data from NASA API.</p>';
}

// Function to save the search date to local storage
function saveSearch(date) {
    const searchItem = document.getElementById('search-input').value;
    let searches = JSON.parse(localStorage.getItem('searches')) || [];
    searches.push(`${date}|${searchItem}`);
    localStorage.setItem('searches', JSON.stringify(searches));
    addSearchToHistory(); // Update the displayed search history
}

// Function to display the search history in the UI
function addSearchToHistory() {
    const historyList = document.getElementById('search-history');
    const dateDisplay = document.getElementById('date');
    historyList.innerHTML = ''; // Clear existing content

    let searches = JSON.parse(localStorage.getItem('searches')) || [];

    searches.forEach(search => {
        const [searchDate, searchItem] = search.split('|');
        const listItem = document.createElement('li');
        listItem.textContent = searchItem;
        listItem.setAttribute('data-date', searchDate); // Store the date as a data attribute

        listItem.addEventListener('click', () => {
            getImageOfTheDay(searchDate); // Fetch the image for the specific date when clicked
        });

        historyList.appendChild(listItem);
    });

    if (searches.length > 0) {
        const latestSearch = searches[searches.length - 1];
        const [latestSearchDate] = latestSearch.split('|');
        dateDisplay.textContent = `Date: ${latestSearchDate}`;
    } else {
        dateDisplay.textContent = ''; // Clear the date if there are no searches
    }
}