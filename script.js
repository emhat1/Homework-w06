// JavaScript for Weather Dashboard using OpenWeather API

// Defining variables
// Search function variables
var searchFormEl = document.querySelector("#locationSearchForm");
var locationInputVal = document.querySelector("#inputLocation");
var searchBtn = document.querySelector("#locationSearch");
// Weather forecast variables
var weatherContentDiv = document.querySelector("#weatherContent");
var cardDivEl = document.querySelector(".card");
var cardTitleEl = document.querySelector(".card-title");
var weatherIconEl = document.querySelector("#icon");
var uvIndexEl = document.querySelector("#uvIndex");
//Previous searches
var usersLocationListGroupEl = document.querySelector(".prev-search");
var existingEntries = JSON.parse(localStorage.getItem("locations"));
// OpenWeather API
var openWeatherQueryUrl = "https://api.openweathermap.org/data/2.5/";
var apiKey = "cd033af87833595589578c0ce5b22666";

// Loading the page
window.onload = function initializeDashboard() {
    // Generating locally saved location list
    if (localStorage.getItem("locations") !== null) {
      for (var i = 0; i < existingEntries.length; i++) {
        // Buttons for previous location listings
        createNewLocationButton(existingEntries[i], usersLocationListGroupEl);
    }
  }
};

// Enacting the location search
function handleSearch(event) {
  event.preventDefault();
  var locationInput = locationInputVal.value.trim();
  if (!locationInput) {
    // Error for invalid search
    errorMessage("Please enter a valid location", searchFormEl, 3000);
    return;
  } else {
    getCurrentWeather(locationInput, apiKey);
    getForecast(locationInput, apiKey);
    locationInputVal.value = "";
    weatherContentDiv.classList.add("hide");
  }
};

// Add eventListener to search button
searchBtn.addEventListener("click",handleSearch)

// Setting dates
var currentDate = new Date();
function getTodaysDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();
  return [day, month, year].join("/");
}

// Accessing weather data
function getCurrentWeather(locationName,apiKey) {
  // Setting limiters including location, API ID, and units in metric (although Kelvin would be fun and confusing)
  var url =
    openWeatherQueryUrl + "weather?q=" + locationName + "&appid=" + apiKey + "&units=metric";


}