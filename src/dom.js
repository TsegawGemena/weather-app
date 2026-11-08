import {
    listenForSearch,
    displayWeather,
    showLoading,
    hideLoading,
    showError,
    clearError
} from "./dom.js";

import { getWeather } from "./api.js";
import { processWeatherData } from "./weather.js";

export function initializeApp() {
    let currentWeather = null;
    let unit = "C";

    const unitButton = document.querySelector("#unit-toggle");

    unitButton.addEventListener("click", () => {
        if (!currentWeather) return;

        unit = unit === "C" ? "F" : "C";

        displayWeather(currentWeather, unit);

        unitButton.textContent =
            unit === "C" ? "Switch to °F" : "Switch to °C";
    });

    listenForSearch(async (city) => {
        clearError();
        showLoading();

        try {
            const data = await getWeather(city);

            currentWeather = processWeatherData(data);

            displayWeather(currentWeather, unit);

        } catch (error) {
            console.error("Failed to fetch weather:", error);
            showError(error.message);

        } finally {
            hideLoading();
        }
    });
}