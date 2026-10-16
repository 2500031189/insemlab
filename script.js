const API_KEY = "d6260b11f104cefb1dd292e29df0d5f1;
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

const form = document.getElementById("weather-form");
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const message = document.getElementById("message");
const weatherCard = document.getElementById("weather-card");

const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const description = document.getElementById("weather-description");
const feelsLike = document.getElementById("feels-like");
const weatherIcon = document.getElementById("weather-icon");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const city = cityInput.value.trim();

  if (!city) {
    showMessage("Please enter a city name.", "error");
    cityInput.focus();
    return;
  }

  if (API_KEY === "d6260b11f104cefb1dd292e29df0d5f1") {
    showMessage("Please add your OpenWeatherMap API key in script.js.", "error");
    return;
  }

  await getWeather(city);
});

async function getWeather(city) {
  searchBtn.disabled = true;
  searchBtn.textContent = "Loading...";
  showMessage("Fetching weather data...", "");
  weatherCard.hidden = true;

  try {
    const url = new URL(API_URL);
    url.searchParams.set("q", city);
    url.searchParams.set("appid", API_KEY);
    url.searchParams.set("units", "metric");

    const response = await fetch(url);

    // fetch() does not reject automatically for HTTP errors.
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("City not found. Please check the spelling.");
      }

      if (response.status === 401) {
        throw new Error("Invalid API key. Please check your API key.");
      }

      if (response.status === 429) {
        throw new Error("Too many requests. Please try again later.");
      }

      throw new Error(
        `Weather service error (${response.status}). Please try again.`
      );
    }

    const data = await response.json();

    if (!data.main || !data.weather?.length) {
      throw new Error("Weather data is incomplete. Please try again.");
    }

    displayWeather(data);
    showMessage("Weather updated successfully!", "success");
  } catch (error) {
    if (error instanceof TypeError) {
      showMessage(
        "Unable to connect. Check your internet connection and try again.",
        "error"
      );
    } else {
      showMessage(error.message, "error");
    }
  } finally {
    searchBtn.disabled = false;
    searchBtn.textContent = "Search";
  }
}

function displayWeather(data) {
  cityName.textContent = `${data.name}, ${data.sys.country}`;
  temperature.textContent = Math.round(data.main.temp);
  humidity.textContent = `${data.main.humidity}%`;
  feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
  description.textContent = data.weather[0].description;

  const iconCode = data.weather[0].icon;
  weatherIcon.src =
    `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  weatherIcon.alt = data.weather[0].description;

  weatherCard.hidden = false;
}

function showMessage(text, type) {
  message.textContent = text;
  message.className = type;
}