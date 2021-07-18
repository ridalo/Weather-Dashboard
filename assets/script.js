var searchButtonEl = document.getElementById("search-btn");
var inputField = document.querySelector("input");
var mainTempEl = document.getElementById("main-temp");
var mainWindEl = document.getElementById("main-wind");
var mainHumid = document.getElementById("main-humid");
var mainUviEl = document.getElementById("main-uv");
var displayHeading = document.getElementById("display-heading");
var history = document.getElementById("history");
var hsDsp = document.getElementById("hs-dsp");
var forcastArea = document.querySelector(".forecast");
currentCity = "wolcott";
var apiBase = "https://api.openweathermap.org/data/2.5/weather?q=";
var apiKey = "&units=imperial&appid=6260169909dd4d4630bd110c87fff970";
var mainDate = document.getElementById("main-date");
var date = moment().format("MM/D/YYYY");

// Fetched Data for current weather information
fetch(apiBase + currentCity + apiKey)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    // console.log(data);

    //Current Location Weather Display
    mainTempEl.textContent = "Temp: " + data.main.temp + "° F";
    mainWindEl.textContent = "Wind: " + data.wind.speed + " MPH";
    mainHumid.textContent = "Humidity: " + data.main.humidity + "%";
    displayHeading.textContent = data.name;
    mainDate.textContent = date;
    var disIcon = document.createElement("img");
    disIcon.setAttribute(
      "src",
      "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png"
    );
    displayHeading.append(disIcon);
    showUV(data.coord.lat, data.coord.lon);
});

searchButtonEl.addEventListener("click", function (event) {
  city = inputField.value;
  event.preventDefault();
  console.log(city);
  if (city === "") {
    alert("Please enter a valid city");
  } else {
    getResults();
    saveSeachData();
  }
});