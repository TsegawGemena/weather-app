import {
    buildUI,
    listenForSearch,
    displayWeather,
    showLoading,
    hideLoading,
    showError,
    clearError,
    updateUnitToggle,
} from "./dom.js";

import { getWeather } from "./api.js";
import { processWeatherData } from "./weather.js";

export function initializeApp() {
    buildUI();

    let currentWeather = null;
    let unit = "C";

    const unitButton = document.querySelector("#unit-toggle");
    updateUnitToggle(unit);

    unitButton.addEventListener("click", () => {
        if (!currentWeather) {
            unit = unit === "C" ? "F" : "C";
            updateUnitToggle(unit);
            return;
        }

        unit = unit === "C" ? "F" : "C";

        displayWeather(currentWeather, unit);
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
