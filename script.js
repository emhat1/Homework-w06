// JavaScript for Weather Dashboard using OpenWeather API

// Search function
var searchFormEl = document.querySelector("#locationSearchForm");
var locationInputVal = document.querySelector("#inputLocation");
var searchBtn = document.querySelector("#locationSearch");




//Previous searches
var usersLocationListGroupEl = document.querySelector(".prev-search");


// Add eventListener to search button
searchBtn.addEventListener("click", // doublecheck command for here);