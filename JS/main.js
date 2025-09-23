const apiKey = "327ca5c195b041c7b15110336251509";
const input = document.getElementById("cityInput");
const suggestionsBox = document.getElementById("suggestions");
const weatherContainer = document.getElementById("weather");

async function getWeather(city) {
    const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3&aqi=no&alerts=no`
    );
    const data = await response.json();
    const todayCondition = data.forecast.forecastday[0].day.condition.text;
    setBackground(todayCondition);
    let box = "";
    data.forecast.forecastday.forEach((day, index) => {
        const date = new Date(day.date);
        box += `
    <div class="card${index === 0 ? " today" : ""}">
      <h3>${date.toLocaleDateString("en-US", { weekday: "long" })}</h3>
      <p>${day.date}</p>
      <h2>${data.location.name}</h2>
      <div class="temp">${day.day.avgtemp_c}°C</div>
      <img src="https:${day.day.condition.icon}" alt="Weather icon">
      <p>${day.day.condition.text}</p>
      <div class="extra">
        🌧 ${day.day.daily_chance_of_rain}% &nbsp; | &nbsp;
        💨 ${day.day.maxwind_kph} km/h
      </div>
    </div>
  `;
    });
    weatherContainer.innerHTML = box;
}

async function getSuggestions(query) {
    const response = await fetch(
        `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`
    );
    const results = await response.json();

    suggestionsBox.innerHTML = "";

    results.forEach((city) => {
        const item = document.createElement("div");
        item.className = "suggestion";
        item.textContent = `${city.name}, ${city.country}`;
        item.addEventListener("click", () => {
            input.value = `${city.name}, ${city.country}`;
            suggestionsBox.innerHTML = "";
            getWeather(city.name);
        });
        suggestionsBox.appendChild(item);
    });
}

function setBackground(condition) {
    condition = condition.toLowerCase();
    let img = "";

    if (condition.includes("sun")) {
        img = "images/sunny.webp";
    } else if (condition.includes("cloud")) {
        img = "images/cloudy.jpg";
    } else if (condition.includes("rain") || condition.includes("drizzle")) {
        img = "images/rainy.jpg";
    } else if (condition.includes("storm") || condition.includes("thunder")) {
        img = "images/storm.jpg";
    } else {
        img = "images/default.jpg";
    }

    document.body.style.backgroundImage = `url('${img}')`;
}


input.addEventListener("input", () => {
    getSuggestions(input.value.trim());
});

window.onload = () => getWeather("Alexandria");