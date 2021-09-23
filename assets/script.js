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
var clearBtnEl = document.getElementById("clear-btn");
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
  if (city === "") {
    alert("Please enter a valid city");
  } else {
    getResults();
    saveSeachData();
  }
});

//funtion to get data from API
var getResults = function () {
  fetch(apiBase + city + apiKey)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      mainTempEl.textContent = "Temp: " + data.main.temp + "° F";
      mainWindEl.textContent = "Wind: " + data.wind.speed + " MPH";
      mainHumid.textContent = "Humidity: " + data.main.humidity + "%";
      displayHeading.textContent = data.name;
      var disIcon = document.createElement("img");
      disIcon.setAttribute(
        "src",
        "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png"
      );
      displayHeading.append(disIcon);

      oneCallApi(data.coord.lat, data.coord.lon);
    });
};
///Funtion to show UVI for Current Day
var showUV = function (lat, lon) {
  var oneCallBase =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&exclude=hourly,minutely,alerts" +
    apiKey;
  fetch(oneCallBase)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      mainUviEl.textContent = data.current.uvi;
      getForcastResults(data);
      if (data.current.uvi <= 3) {
        mainUviEl.setAttribute("class", "green");
      }else{
        mainUviEl.setAttribute("class", "red");
      }
    });
};

//One call api with all the data both current and daily
var oneCallApi = function (lat, lon) {
  var oneCallBase =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&exclude=hourly,minutely,alerts" +
    apiKey;
  fetch(oneCallBase)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      mainUviEl.textContent = data.current.uvi;
      getForcastResults(data);
    });
};

///Function for setting 5 day forcast
var getForcastResults = function (data) {
  forcastArea.innerHTML = "";
  for (let i = 0; i < 5; i++) {
    var castdate = moment()
      .add(i + 1, "days")
      .format("MM/D/YYYY");

    var castBlock = document.createElement("div");
    castBlock.setAttribute("class", "block");
    var forecastDateEl = document.createElement("h3");
    var iconEl = document.createElement("img");
    var tempEl = document.createElement("p");
    var windEl = document.createElement("p");
    var humidityEl = document.createElement("p");
    var uvEl = document.createElement("p");
    forecastDateEl.setAttribute("class", "forcast-date");
    iconEl.setAttribute(
      "src",
      "http://openweathermap.org/img/w/" +
        data.daily[i].weather[0].icon +
        ".png"
    );
    forecastDateEl.textContent = castdate;
    tempEl.textContent = "Temp: " + data.daily[i].temp.day + "° F";
    windEl.textContent = "Wind: " + data.daily[i].wind_speed + " MPH";
    humidityEl.textContent = "Humidity: " + data.daily[i].humidity + "%";
    uvEl.textContent = "UV Index: " + data.daily[i].uvi;

    forcastArea.append(castBlock);
    castBlock.append(forecastDateEl, iconEl, tempEl, windEl, humidityEl, uvEl);
  }
};

//save data to local storage
var oldData = [];
var saveSeachData = function () {
  newData = {
    text: city,
  };
  oldData.push(newData);
  localStorage.setItem("search", JSON.stringify(oldData));
};

//Load data from local storage
var loadData = function () {
  oldData = JSON.parse(localStorage.getItem("search")) || [];
  for (var i = 0; i < oldData.length; i++) {
    search = document.createElement("p");
    search.setAttribute("class", "dsp");
    search.textContent = oldData[i].text;
    hsDsp.append(search);

    search.addEventListener("click", function () {
      val = this.textContent;
      Results(val);
    });
  }
};
loadData();

var Results = function (val) {
  fetch(apiBase + val + apiKey)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      mainTempEl.textContent = "Temp: " + data.main.temp + "° F";
      mainWindEl.textContent = "Wind: " + data.wind.speed + " MPH";
      mainHumid.textContent = "Humidity: " + data.main.humidity + "%";
      displayHeading.textContent = data.name;
      var disIcon = document.createElement("img");
      disIcon.setAttribute(
        "src",
        "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png"
      );
      displayHeading.append(disIcon);

      oneCallApi(data.coord.lat, data.coord.lon);
    });
};

clearBtnEl.addEventListener("click", function () {
  localStorage.clear();
});