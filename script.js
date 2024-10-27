const apiKey = 'ENTER YOUR OWN API KEY';
const baseUrl = 'https://api.openweathermap.org/data/2.5/';

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `[${day}-${month}-${year}]`;
}

const dateTimeElement = document.getElementById('date-time');
const updateDateTime = () => {
    const now = new Date();
    dateTimeElement.textContent = formatDate(now);
};
updateDateTime();
setInterval(updateDateTime, 60000);

async function fetchWeather(city) {
    try {
        const response = await fetch(`${baseUrl}weather?q=${city}&units=metric&appid=${apiKey}`);
        if (!response.ok) throw new Error("City not found");
        const data = await response.json();
        displayCurrentWeather(data);

        const forecastResponse = await fetch(`${baseUrl}forecast?q=${city}&units=metric&appid=${apiKey}`);
        const forecastData = await forecastResponse.json();
        displayWeeklyForecast(forecastData);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert(error.message);
    }
}

async function fetchWeatherByLocation(lat, lon) {
    try {
        const response = await fetch(`${baseUrl}weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
        const data = await response.json();
        displayCurrentWeather(data);

        const forecastResponse = await fetch(`${baseUrl}forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
        const forecastData = await forecastResponse.json();
        displayWeeklyForecast(forecastData);
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

function displayCurrentWeather(data) {
    document.getElementById('city-name').textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById('temperature').textContent = `Temperature: ${data.main.temp} °C`;
    document.getElementById('wind').textContent = `Wind: ${data.wind.speed} m/s`;
    document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;

    const iconCode = data.weather[0].icon;
    document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${iconCode}.png`;
    document.getElementById('weather-icon').alt = data.weather[0].description;
}

function displayWeeklyForecast(forecastData) {
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = '';

    for (let i = 0; i < forecastData.list.length; i += 8) {
        const forecast = forecastData.list[i];
        const date = new Date(forecast.dt * 1000);
        const dayName = date.toLocaleDateString('en-EN', { weekday: 'long' });
        const formattedDate = formatDate(date);

        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';

        forecastItem.innerHTML = `
            <p>${dayName}</p>
            <p>${formattedDate}</p>
            <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="${forecast.weather[0].description}" style="width: 60px; height: 60px;">
            <p>Temp: ${forecast.main.temp} °C</p>
            <p>Wind: ${forecast.wind.speed} m/s</p>
            <p>Humidity: ${forecast.main.humidity}%</p>
        `;

        forecastContainer.appendChild(forecastItem);
    }
}

function getLocationAndFetchWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeatherByLocation(lat, lon);
        }, error => {
            alert("Unable to retrieve your location. Please enter a city name.");
            console.error("Geolocation error:", error);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}
