
const form = document.getElementById("weather-form");
const cityInput = document.getElementById("city-input");
const message = document.getElementById("message");
const result = document.getElementById("weather-result");

const weatherTypes = {
  0: ["Clear sky", "☀️"],
  1: ["Mainly clear", "🌤️"],
  2: ["Partly cloudy", "⛅"],
  3: ["Overcast", "☁️"],
  45: ["Foggy", "🌫️"],
  48: ["Foggy", "🌫️"],
  51: ["Light drizzle", "🌦️"],
  53: ["Drizzle", "🌦️"],
  55: ["Heavy drizzle", "🌧️"],
  61: ["Light rain", "🌦️"],
  63: ["Rain", "🌧️"],
  65: ["Heavy rain", "🌧️"],
  71: ["Light snow", "🌨️"],
  73: ["Snow", "❄️"],
  75: ["Heavy snow", "❄️"],
  80: ["Rain showers", "🌦️"],
  81: ["Rain showers", "🌧️"],
  82: ["Heavy showers", "⛈️"],
  95: ["Thunderstorm", "⛈️"],
  96: ["Thunderstorm with hail", "⛈️"],
  99: ["Thunderstorm with hail", "⛈️"]
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const city = cityInput.value.trim();

  if (!city) {
    message.textContent = "Please enter a city name.";
    return;
  }

  result.hidden = true;
  message.textContent = "Loading weather...";

  try {
    const geoURL =
      "https://geocoding-api.open-meteo.com/v1/search?name=" +
      encodeURIComponent(city) +
      "&count=1&language=en&format=json";

    const geoResponse = await fetch(geoURL);

    if (!geoResponse.ok) {
      throw new Error("Unable to search for the city.");
    }

    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error("City not found. Check the spelling.");
    }

    const place = geoData.results[0];

    const weatherURL =
      "https://api.open-meteo.com/v1/forecast" +
      `?latitude=${place.latitude}` +
      `&longitude=${place.longitude}` +
      "&current=temperature_2m,relative_humidity_2m," +
      "apparent_temperature,is_day,precipitation," +
      "weather_code,wind_speed_10m&timezone=auto";

    const weatherResponse = await fetch(weatherURL);

    if (!weatherResponse.ok) {
      throw new Error("Unable to retrieve weather data.");
    }

    const weatherData = await weatherResponse.json();
    const current = weatherData.current;

    const [description, icon] =
      weatherTypes[current.weather_code] ||
      ["Weather conditions unavailable", "🌡️"];

    document.getElementById("city-name").textContent =
      `${place.name}, ${place.country}`;

    document.getElementById("weather-icon").textContent =
      current.is_day === 0 && current.weather_code === 0
        ? "🌙"
        : icon;

    document.getElementById("description").textContent =
      description;

    document.getElementById("temperature").textContent =
      Math.round(current.temperature_2m);

    document.getElementById("humidity").textContent =
      `${current.relative_humidity_2m}%`;

    document.getElementById("wind").textContent =
      `${current.wind_speed_10m} km/h`;

    result.hidden = false;
    message.textContent =
      `Updated: ${current.time.replace("T", " ")}`;

  } catch (error) {
    message.textContent =
      error.message || "Something went wrong. Please try again.";
  }
});
