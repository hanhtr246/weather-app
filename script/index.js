function enterCity(event) {
  event.preventDefault();
  let inputCity = document.querySelector("#city").value;
  searchWeather(inputCity);
}
function searchWeather(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayWeather);
}
function getUserLocation(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayWeather);
}
function getForcast(coordinates, forecastUnits) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${forecastUnits}`;
  axios.get(apiUrl).then(displayForecast);
}

function formatTime(timestamp) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let now = new Date(timestamp * 1000);
  let date = now.getDate();
  let day = days[now.getDay()];
  let month = months[now.getMonth()];
  let hour = now.getHours();
  let minute = now.getMinutes();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  if (minute < 10) {
    minute = `0${minute}`;
  }
  let showDate = `${day}, ${month} ${date}`;
  let showTime = `${hour}:${minute}`;
  return [showDate, showTime];
}

function updateTime(timestamp) {
  let formattedTime = formatTime(timestamp);
  let dateElement = document.querySelector("#date");
  let timeElement = document.querySelector("#time");
  dateElement.innerHTML = formattedTime[0];
  timeElement.innerHTML = formattedTime[1];
}

function updateIcon(description, iconInfo) {
  let lowerDescription = description.toLowerCase();
  if (iconInfo.substring(0, 2) == "50" || lowerDescription == "clear") {
    iconFileName = iconInfo;
  } else {
    iconFileName = lowerDescription;
  }
  return iconFileName;
}

function convertToFahrenheit(event) {
  event.preventDefault();
  let temperatureF = temperatureC * 1.8 + 32;
  document.querySelector(".current-temperature").innerHTML =
    Math.round(temperatureF);
  styleToUnit("Fahrenheit");
  getForcast(currentCoord, "imperial");
}

function convertToCelcius(event) {
  event.preventDefault();
  document.querySelector(".current-temperature").innerHTML =
    Math.round(temperatureC);
  styleToUnit("Celcius");
  getForcast(currentCoord, units);
}

function styleToUnit(destinationUnit) {
  if (destinationUnit[0] == "C") {
    scaleC.classList.remove("active");
    scaleF.classList.add("active");
    document.querySelector("#degree-C").style.color = "#ff3366";
    document.querySelector("#degree-F").style.color = "#616074";
  } else {
    scaleC.classList.add("active");
    scaleF.classList.remove("active");
    document.querySelector("#degree-F").style.color = "#ff3366";
    document.querySelector("#degree-C").style.color = "#616074";
  }
}

function displayWeather(response) {
  styleToUnit("Celcius");
  temperatureC = response.data.main.temp;
  let description = response.data.weather[0].main;
  let iconInfo = response.data.weather[0].icon;

  document.querySelector(".current-temperature").innerHTML =
    Math.round(temperatureC);
  document.querySelector("#description").innerHTML = description;
  document.querySelector("h1").innerHTML = response.data.name;
  document.querySelector("#temp-min").innerHTML = Math.round(
    response.data.main.temp_min
  );
  document.querySelector("#temp-max").innerHTML = Math.round(
    response.data.main.temp_max
  );
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document
    .querySelector("#description-icon")
    .setAttribute("href", `images/${updateIcon(description, iconInfo)}.svg`);

  window.currentCoord = response.data.coord;
  updateTime(response.data.dt);
  getForcast(currentCoord, units);
}

function displayForecast(response) {
  let forecastData = response.data.daily;
  console.log(forecastData);
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  forecastData.forEach(function (forecastDay, index) {
    if ((index > 0) & (index < 6)) {
      let iconForecast = updateIcon(
        forecastDay.weather[0].main,
        forecastDay.weather[0].icon
      );
      forecastHTML += `<div class="col forecast-cols">${formatTime(
        forecastDay.dt
      )[0].substring(0, 3)}
          <div>
          <svg class="small-icon"><image class="bi" width="30px" height="30px" href="images/${iconForecast}.svg"/></svg>
          </div>
          ${Math.round(forecastDay.temp.min)}<strong>/${Math.round(
        forecastDay.temp.max
      )}°</strong>
        </div>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

let enterButton = document.querySelector(".city-form");
enterButton.addEventListener("submit", enterCity);
let locationButton = document.querySelector(".location-button");
locationButton.addEventListener("click", function () {
  navigator.geolocation.getCurrentPosition(getUserLocation);
});

let scaleC = document.querySelector("#degree-C");
scaleC.addEventListener("click", convertToCelcius);
let scaleF = document.querySelector("#degree-F");
scaleF.addEventListener("click", convertToFahrenheit);

let apiKey = "a47ca9fe29317629114f50ba968f7192";
let units = "metric";
let temperatureC = null;
let iconFileName = null;
searchWeather("Paris");
