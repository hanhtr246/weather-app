function changeCity(event) {
  event.preventDefault();
  let inputCity = document.querySelector("#city").value;
  search(inputCity);
}
function search(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(getWeather);
}

function getLocation(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(getWeather);
}

function changeTime(timestamp) {
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
  let now = new Date(timestamp);
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

  let currentDate = document.querySelector("#date");
  let currentTime = document.querySelector("#time");
  currentDate.innerHTML = showDate;
  currentTime.innerHTML = showTime;
}

function formatDay(timestamp) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let now = new Date(timestamp * 1000);
  let day = days[now.getDay()].substring(0, 3);
  return day;
}

function changeIcon(description, iconInfo) {
  let lowerDescription = description.toLowerCase();
  if (iconInfo.substring(0, 2) == "50" || lowerDescription == "clear") {
    iconFileName = iconInfo;
  } else {
    iconFileName = lowerDescription;
  }

  // document
  //   .querySelector("#description-icon")
  //   .setAttribute("href", `images/${iconFileName}.svg`);
  return iconFileName;
}

function getForcast(coordinates) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayForecast);
}

function getWeather(response) {
  temperatureC = response.data.main.temp;
  scaleC.classList.remove("active");
  scaleF.classList.add("active");
  document.querySelector("#degree-C").style.color = "#ff3366";
  document.querySelector("#degree-F").style.color = "#616074";
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
  changeTime(response.data.dt * 1000);
  // changeIcon(description, iconInfo);
  document
    .querySelector("#description-icon")
    .setAttribute("href", `images/${changeIcon(description, iconInfo)}.svg`);
  getForcast(response.data.coord);
}

function changeToFahrenheit(event) {
  event.preventDefault();
  let temperatureF = temperatureC * 1.8 + 32;
  document.querySelector(".current-temperature").innerHTML =
    Math.round(temperatureF);
  scaleC.classList.add("active");
  scaleF.classList.remove("active");
  document.querySelector("#degree-F").style.color = "#ff3366";
  document.querySelector("#degree-C").style.color = "#616074";
}

function changeToCelcius(event) {
  event.preventDefault();
  document.querySelector(".current-temperature").innerHTML =
    Math.round(temperatureC);
  scaleC.classList.remove("active");
  scaleF.classList.add("active");
  document.querySelector("#degree-C").style.color = "#ff3366";
  document.querySelector("#degree-F").style.color = "#616074";
}

function displayForecast(response) {
  let forecastData = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  forecastData.forEach(function (forecastDay, index) {
    if ((index > 0) & (index < 6)) {
      let iconForecast = changeIcon(
        forecastDay.weather[0].main,
        forecastDay.weather[0].icon
      );
      forecastHTML += `<div class="col forecast-cols">${formatDay(
        forecastDay.dt
      )}
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

changeTime();

let enterButton = document.querySelector(".city-form");
enterButton.addEventListener("submit", changeCity);

let scaleC = document.querySelector("#degree-C");
scaleC.addEventListener("click", changeToCelcius);
let scaleF = document.querySelector("#degree-F");
scaleF.addEventListener("click", changeToFahrenheit);

let locationButton = document.querySelector(".location-button");
locationButton.addEventListener("click", function () {
  navigator.geolocation.getCurrentPosition(getLocation);
});

let apiKey = "a47ca9fe29317629114f50ba968f7192";
let units = "metric";
let temperatureC = null;
let iconFileName = null;
search("Paris");
