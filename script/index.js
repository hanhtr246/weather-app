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
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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
  let showDate = `${day} ${month} ${date}`;
  let showTime = `${hour}:${minute}`;

  let currentDate = document.querySelector("#date");
  let currentTime = document.querySelector("#time");
  currentDate.innerHTML = showDate;
  currentTime.innerHTML = showTime;
}

function getWeather(response) {
  temperatureC = response.data.main.temp;
  document.querySelector(".current-temperature").innerHTML =
    Math.round(temperatureC);
  document.querySelector("#description").innerHTML =
    response.data.weather[0].main;
  document.querySelector("h1").innerHTML = response.data.name;
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  changeTime(response.data.dt * 1000);
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
search("Hanoi");
