
export function listenForSearch(callback) {
    const searchForm = document.querySelector("#search form");
    const cityInput = document.querySelector("#city");

    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const city = cityInput.value.trim();

        if (city) {
            callback(city);
        }
    });
}

export function displayWeather(weatherData, unit) {
    const app = document.querySelector("#app");

    const city = app.querySelector(".city-name");
    const temperature = app.querySelector(".temperature");
    const conditions = app.querySelector(".conditions");
    const humidity = app.querySelector(".humidity");

    let temp = weatherData.temperature;

    if (unit === "F") {
        temp = (temp * 9 / 5) + 32;
    }

    city.textContent = weatherData.city;
    temperature.textContent = `${temp.toFixed(1)}°${unit}`;
    conditions.textContent = weatherData.conditions;
    humidity.textContent = `Humidity: ${weatherData.humidity}%`;
}

export function showLoading() {
    const loading = document.querySelector("#loading");
    loading.textContent = "Loading weather...";
}

export function hideLoading() {
    const loading = document.querySelector("#loading");
    loading.textContent = "";
}

export function showError(message) {
    const error = document.querySelector("#error");
    error.textContent = message;
}

export function clearError() {
    const error = document.querySelector("#error");
    error.textContent = "";
}
