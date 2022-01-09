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
// Miscellaneous
var currentDate = new Date();

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
function getTodaysDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();
  return [day, month, year].join("/");
};

// Access current weather data
function getCurrentWeather(locationName,apiKey) {
  // Setting limiters including location, API ID, and units in metric (although Kelvin would be fun and confusing)
  var url = openWeatherQueryUrl + "weather?q=" + locationName + "&appid=" + apiKey + "&units=metric";

  fetch(url)
  // Ensure OpenWeather page is accessible / valid
  .then(function (response) {
    if (!response.ok) {
      console.log("There is an issue. Status Code: " + response.status);
      errorMessage(
        "I cannot find any results for " + locationName + ".  Please enter an alternative location",
        weatherContentDiv,
        4000
      );
      return;
    } 
    // Continue if page and data is accessible
    else {
      return response.json();
    }
  })
  .then(function (weatherData) {
    weatherContentDiv.classList.remove("hide");
    displayCurrentWeather(weatherData);
  
  //Add location to previous location list
  var isNew = true;

  if (localStorage.getItem("locations") !== null) {
    for (var i = 0; i < existingEntries.length; i++) {
      if (existingEntries[i] === weatherData.name) {
        isNew = false;
      }
    }
    if (isNew) {
      existingEntries.push(weatherData.name);
      localStorage.setItem("locations", JSON.stringify(existingEntries));
      createNewLocationButton(weatherData.name, usersLocationListGroupEl);
    }
  } else {
    existingEntries = [];
    existingEntries.push(weatherData.name);
    localStorage.setItem("locations", JSON.stringify(existingEntries));
    createNewLocationButton(weatherData.name, usersLocationListGroupEl);
  }
});
}

// Access UV intensity
function getUVIndex(lat, lon, apiKey) {
  uvIndexQueryUrl = openWeatherQueryUrl + "uvi?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
  fetch(uvIndexQueryUrl)
    // Ensure OpenWeather page is accessible / valid
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }
      return response.json();
    })
    .then(function (uvData) {
      var uvIndex = uvData.value;

      // Colour-code on page for UV intensity
      if (uvIndex <= 2) {
        colorClass = "green";
      } else if (uvIndex <= 5) {
        colorClass = "yellow";
      } else if (uvIndex <= 7) {
        colorClass = "orange";
      } else if (uvIndex <= 10) {
        colorClass = "red";
      } else if (uvIndex > 10) {
        colorClass = "violet";
      }
      document.querySelector("#uvIndex").setAttribute("class", colorClass);
      uvIndexEl.textContent = uvIndex;
    })
  }
  
// Access five day forecast
function getForecast(locationName, apiKey) {
  var url = openWeatherQueryUrl + "forecast?q=" + locationName + "&appid=" + apiKey + "&units=metric";

  fetch(url)
    // Ensure OpenWeather page is accessible / valid
    .then(function (response) {
      if (!response.ok) {
        console.log("There is an issue. Status Code: " + response.status);
        return;
      } 
        // Continue if page and data is accessible
      else {
        return response.json();
      }
    })
    .then(function (forecastData) {
       var ourForecastObject = [];
       for (var i = 0; i < forecastData.list.length; i++) {
         if (i % 8 === 0) {
           ourForecastObject.push({
            date: forecastData.list[i].dt_txt.split(" ")[0],
            icon: forecastData.list[i].weather[0].icon,
            iconAlt: forecastData.list[i].weather[0].description,
            temp: forecastData.list[i].main.temp,
            humidity: forecastData.list[i].main.humidity,
          });
        }
      }
      for (var i = 0; i < ourForecastObject.length; i++) {
        var dateTitle = document.querySelectorAll(".date-title");
        var iconEl = document.querySelectorAll("#forecastIcon");
        var tempSpan = document.querySelectorAll("#tempForecast");
        var humiditySpan = document.querySelectorAll("#humidityForecast");

        dateTitle[i].textContent = getTodaysDate(ourForecastObject[i].date);
        iconEl[i].setAttribute("src","https://openweathermap.org/img/wn/" + ourForecastObject[i].icon + "@2x.png");
        iconEl[i].setAttribute("alt", ourForecastObject[i].iconAlt);
        tempSpan[i].textContent = ourForecastObject[i].temp + " °C";
        humiditySpan[i].textContent = ourForecastObject[i].humidity + "%";
      }
    })
  }

function displayCurrentWeather(resultObj) {
  // Display location / date information and correct icons on page
  cardTitleEl.textContent = resultObj.name + " (" + getTodaysDate(currentDate) + ") ";
  weatherIconEl.setAttribute("src","https://openweathermap.org/img/wn/" + resultObj.weather[0].icon + "@2x.png");
  weatherIconEl.setAttribute("alt", resultObj.weather[0].description);
  cardTitleEl.append(weatherIconEl);

  var tempEl = document.querySelector("#temp");
  var humidityEl = document.querySelector("#humidity");
  var windSpeedEl = document.querySelector("#windSpeed");

  // Display temperature data
  if (resultObj.main.temp) {
    tempEl.textContent = resultObj.main.temp + " °C";
  } else {
    tempEl.textContent = "I can't find temperature readings for this location";
  }

  // Display humidity data
  if (resultObj.main.humidity) {
    humidityEl.textContent = resultObj.main.humidity + "%";
  } else {
    humidityEl.textContent = "I can't find humidity readings for this location";
  }

  // Display wind speed data
  if (resultObj.wind.speed) {
    windSpeedEl.textContent = resultObj.wind.speed + " km/h";
  } else {
    windSpeedEl.textContent = "I can't find wind speed readings for this location";
  }

 // Display UV data
  if (resultObj.coord.lat && resultObj.coord.lon) {
    var lat = resultObj.coord.lat;
    var lon = resultObj.coord.lon;
    getUVIndex(lat, lon, apiKey);
  } else {
    uvIndexEl.textContent = "I can't find UV index readings for this location";
  }
}

// Add location to previously searched locations list
function createNewLocationButton(locationName, location) {
  var locationBtnEl = document.createElement("button");
  locationBtnEl.setAttribute("type", "button");
  locationBtnEl.classList.add("list-group-item", "list-group-item-action");
  locationBtnEl.textContent = locationName;
  locationBtnEl.setAttribute("value", locationName);
  location.prepend(locationBtnEl);
  locationBtnEl.addEventListener("click", function () {
    var allLocationBtns = document.querySelectorAll(".list-group-item");
    for (var i = 0; i < allLocationBtns.length; i++) {
      allLocationBtns[i].classList.remove("active");
    }
    getCurrentWeather(locationBtnEl.value, apiKey);
    getForecast(locationBtnEl.value, apiKey);
    locationBtnEl.classList.add("active");
  });
}
