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

// Loading the page
window.onload = function initializeDashboard() {
    // Generating locally saved location list
    if (localStorage.getItem("location") !== null) {
      for (var i = 0; i < existingEntries.length; i++) {
        // Buttons for previous location listings
        createNewLocationButton(existingEntries[i], usersLocationListGroupEl);
     
    }


// Add eventListener to search button
searchBtn.addEventListener("click",handleSearch)