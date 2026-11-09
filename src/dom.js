const refs = {};

export function buildUI() {
    if (document.getElementById("skycast-app")) return;

    document.body.innerHTML = "";

    const app = el("div", { id: "skycast-app", class: "skycast" });

    app.append(
        buildHeader(),
        buildStatusBar(),
        buildDashboard()
    );

    document.body.appendChild(app);
    cacheRefs();
}

function buildHeader() {
    const header = el("header", { class: "skycast-header" });

    const brand = el("div", { class: "brand" });
    brand.append(
        icon("cloud", "brand-icon"),
        el("div", { class: "brand-copy" }, [
            el("h1", { class: "brand-name", text: "SkyCast" }),
            el("p", { class: "brand-tagline", text: "Your weather, at a glance." }),
        ])
    );

    const search = el("form", { id: "search", class: "search-form" });
    const searchWrap = el("div", { class: "search-wrap" });
    const cityInput = el("input", {
        type: "text",
        id: "city",
        name: "city",
        placeholder: "San Francisco, US",
        autocomplete: "off",
    });
    const searchBtn = el("button", {
        type: "submit",
        class: "search-btn",
        text: "Search",
    });
    searchBtn.append(icon("arrow-right", "search-arrow"));
    searchWrap.append(cityInput, searchBtn);
    search.append(searchWrap);

    const actions = el("div", { class: "header-actions" });

    const unitToggle = el("button", {
        type: "button",
        id: "unit-toggle",
        class: "unit-toggle",
        "aria-label": "Toggle temperature unit",
    });
    unitToggle.append(
        el("span", { class: "unit-option is-active", "data-unit": "C", text: "°C" }),
        el("span", { class: "unit-divider", text: "/" }),
        el("span", { class: "unit-option", "data-unit": "F", text: "°F" })
    );

    const live = el("div", { class: "live-station" }, [
        el("span", { class: "live-dot" }),
        el("span", { text: "Live Station" }),
    ]);

    actions.append(unitToggle, live);
    header.append(brand, search, actions);
    return header;
}

function buildStatusBar() {
    return el("div", { class: "status-bar" }, [
        el("p", { id: "loading", class: "status-loading" }),
        el("p", { id: "error", class: "status-error" }),
    ]);
}

function buildDashboard() {
    const dashboard = el("main", { id: "app", class: "dashboard" });

    const left = el("div", { class: "dashboard-left" });
    left.append(
        buildCurrentCard(),
        buildHourlyCard(),
        buildDetailsGrid()
    );

    const right = el("div", { class: "dashboard-right" });
    right.append(buildDailyCard(), buildAirQualityCard());

    dashboard.append(left, right);
    return dashboard;
}

function buildCurrentCard() {
    const card = el("section", { class: "card current-card" });

    const top = el("div", { class: "current-top" });
    const info = el("div", { class: "current-info" });
    info.append(
        el("h2", { class: "current-city city-name", text: "—" }),
        el("p", { class: "current-conditions conditions", text: "Search for a city" }),
        el("div", { class: "current-meta" }, [
            el("span", { class: "current-hl", text: "H: — L: —" }),
            el("span", { class: "current-feels", text: "Feels like —" }),
            el("span", { class: "humidity", text: "Humidity: —" }),
        ])
    );

    const tempBlock = el("div", { class: "current-temp-block" });
    tempBlock.append(
        el("div", { class: "temperature current-temp", text: "—°" }),
        el("div", { class: "current-icon-wrap" }, [icon("partly-cloudy-day", "current-weather-icon")])
    );

    top.append(info, tempBlock);

    const footer = el("div", { class: "current-footer" }, [
        icon("clock", "footer-clock"),
        el("span", { class: "current-updated", text: "Waiting for data" }),
    ]);

    card.append(top, footer);
    return card;
}

function buildHourlyCard() {
    const card = el("section", { class: "card hourly-card" });

    const header = el("div", { class: "card-header" }, [
        el("div", { class: "card-title" }, [
            icon("clock", "card-title-icon"),
            el("h3", { text: "Hourly Forecast" }),
        ]),
        el("span", { class: "card-subtitle", text: "Next 24 Hours" }),
    ]);

    const track = el("div", { class: "hourly-track" });
    for (let i = 0; i < 7; i += 1) {
        track.append(buildHourlyItem({
            label: i === 0 ? "Now" : "--:--",
            temp: "—",
            precipProb: "—",
            icon: "partly-cloudy-day",
            isNow: i === 0,
        }));
    }

    card.append(header, track);
    return card;
}

function buildHourlyItem(item) {
    const node = el("div", {
        class: `hourly-item${item.isNow ? " is-now" : ""}`,
    });

    node.append(
        el("span", { class: "hourly-time", text: item.label }),
        icon(item.icon || "partly-cloudy-day", "hourly-icon"),
        el("span", { class: "hourly-temp", text: typeof item.temp === "number" ? `${Math.round(item.temp)}°` : `${item.temp}°` }),
        el("span", { class: "hourly-precip", text: typeof item.precipProb === "number" ? `${Math.round(item.precipProb)}%` : `${item.precipProb}%` })
    );

    return node;
}

function buildDetailsGrid() {
    const grid = el("div", { class: "details-grid" });

    const cards = [
        {
            key: "feels",
            title: "Feels Like",
            icon: "thermometer",
            valueClass: "detail-feels-value",
            noteClass: "detail-feels-note",
            value: "—",
            note: "—",
        },
        {
            key: "wind",
            title: "Wind Speed",
            icon: "wind",
            valueClass: "detail-wind-value",
            noteClass: "detail-wind-note",
            extraClass: "detail-wind-dir",
            value: "—",
            extra: "—",
            note: "—",
        },
        {
            key: "humidity",
            title: "Humidity",
            icon: "droplet",
            valueClass: "detail-humidity-value",
            noteClass: "detail-humidity-bar",
            value: "—",
            hasBar: true,
            barClass: "humidity-bar-fill",
        },
        {
            key: "pressure",
            title: "Pressure",
            icon: "gauge",
            valueClass: "detail-pressure-value",
            noteClass: "detail-pressure-note",
            value: "—",
            note: "—",
        },
        {
            key: "visibility",
            title: "Visibility",
            icon: "eye",
            valueClass: "detail-visibility-value",
            noteClass: "detail-visibility-note",
            value: "—",
            note: "—",
        },
        {
            key: "uv",
            title: "UV Index",
            icon: "sun",
            valueClass: "detail-uv-value",
            noteClass: "detail-uv-bar",
            value: "—",
            hasBar: true,
            barClass: "uv-bar-fill",
        },
    ];

    cards.forEach((card) => {
        const node = el("section", { class: `card detail-card detail-${card.key}` });
        const title = el("div", { class: "detail-title" }, [
            icon(card.icon, "detail-icon"),
            el("span", { text: card.title }),
        ]);

        const value = el("div", { class: `detail-value ${card.valueClass}`, text: card.value });
        node.append(title, value);

        if (card.extraClass) {
            node.append(el("div", { class: `detail-extra ${card.extraClass}`, text: card.extra }));
        }

        if (card.hasBar) {
            const bar = el("div", { class: "progress-bar" }, [
                el("div", { class: `progress-fill ${card.barClass}` }),
            ]);
            node.append(bar);
        } else {
            node.append(el("p", { class: `detail-note ${card.noteClass}`, text: card.note }));
        }

        grid.append(node);
    });

    return grid;
}

function buildDailyCard() {
    const card = el("section", { class: "card daily-card" });

    const header = el("div", { class: "card-header" }, [
        el("div", { class: "card-title" }, [
            icon("calendar", "card-title-icon"),
            el("h3", { text: "5-Day Forecast" }),
        ]),
    ]);

    const location = el("p", { class: "daily-location", text: "—" });
    const list = el("div", { class: "daily-list" });

    for (let i = 0; i < 5; i += 1) {
        list.append(buildDailyRow({
            label: i === 0 ? "Today" : "—",
            icon: "partly-cloudy-day",
            tempMin: "—",
            tempMax: "—",
            minPct: 10,
            maxPct: 70,
        }));
    }

    card.append(header, location, list);
    return card;
}

function buildDailyRow(day) {
    const row = el("div", { class: "daily-row" });
    const low = typeof day.tempMin === "number" ? `${Math.round(day.tempMin)}°` : `${day.tempMin}°`;
    const high = typeof day.tempMax === "number" ? `${Math.round(day.tempMax)}°` : `${day.tempMax}°`;

    const bar = el("div", { class: "temp-range-bar" }, [
        el("div", {
            class: "temp-range-fill",
            style: `left:${day.minPct}%; width:${Math.max(day.maxPct - day.minPct, 8)}%;`,
        }),
    ]);

    row.append(
        el("span", { class: "daily-day", text: day.label }),
        icon(day.icon || "partly-cloudy-day", "daily-icon"),
        el("span", { class: "daily-low", text: low }),
        bar,
        el("span", { class: "daily-high", text: high })
    );

    return row;
}

function buildAirQualityCard() {
    const card = el("section", { class: "card aqi-card" });

    const header = el("div", { class: "card-header" }, [
        el("div", { class: "card-title" }, [
            icon("waves", "card-title-icon"),
            el("h3", { text: "Air Quality" }),
        ]),
        el("span", { class: "aqi-badge", text: "—" }),
    ]);

    const message = el("p", {
        class: "aqi-message",
        text: "Search a city to see air quality insights.",
    });

    const metrics = el("div", { class: "aqi-metrics" }, [
        metricBox("PM2.5", "—", "aqi-pm25"),
        metricBox("PM10", "—", "aqi-pm10"),
        metricBox("O3", "—", "aqi-o3"),
    ]);

    card.append(header, message, metrics);
    return card;
}

function metricBox(label, value, valueClass) {
    return el("div", { class: "aqi-metric" }, [
        el("span", { class: "aqi-metric-label", text: label }),
        el("span", { class: `aqi-metric-value ${valueClass}`, text: value }),
    ]);
}

function cacheRefs() {
    refs.cityInput = document.querySelector("#city");
    refs.searchForm = document.querySelector("#search");
    refs.unitToggle = document.querySelector("#unit-toggle");
    refs.loading = document.querySelector("#loading");
    refs.error = document.querySelector("#error");
    refs.cityName = document.querySelector(".city-name");
    refs.temperature = document.querySelector(".temperature");
    refs.conditions = document.querySelector(".conditions");
    refs.humidity = document.querySelector(".humidity");
    refs.currentHl = document.querySelector(".current-hl");
    refs.currentFeels = document.querySelector(".current-feels");
    refs.currentUpdated = document.querySelector(".current-updated");
    refs.currentIconWrap = document.querySelector(".current-icon-wrap");
    refs.hourlyTrack = document.querySelector(".hourly-track");
    refs.dailyList = document.querySelector(".daily-list");
    refs.dailyLocation = document.querySelector(".daily-location");
    refs.detailFeelsValue = document.querySelector(".detail-feels-value");
    refs.detailFeelsNote = document.querySelector(".detail-feels-note");
    refs.detailWindValue = document.querySelector(".detail-wind-value");
    refs.detailWindDir = document.querySelector(".detail-wind-dir");
    refs.detailWindNote = document.querySelector(".detail-wind-note");
    refs.detailHumidityValue = document.querySelector(".detail-humidity-value");
    refs.humidityBarFill = document.querySelector(".humidity-bar-fill");
    refs.detailPressureValue = document.querySelector(".detail-pressure-value");
    refs.detailPressureNote = document.querySelector(".detail-pressure-note");
    refs.detailVisibilityValue = document.querySelector(".detail-visibility-value");
    refs.detailVisibilityNote = document.querySelector(".detail-visibility-note");
    refs.detailUvValue = document.querySelector(".detail-uv-value");
    refs.uvBarFill = document.querySelector(".uv-bar-fill");
    refs.aqiBadge = document.querySelector(".aqi-badge");
    refs.aqiMessage = document.querySelector(".aqi-message");
    refs.aqiPm25 = document.querySelector(".aqi-pm25");
    refs.aqiPm10 = document.querySelector(".aqi-pm10");
    refs.aqiO3 = document.querySelector(".aqi-o3");
}

export function listenForSearch(callback) {
    const searchForm = document.querySelector("#search");
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
    const convert = (temp) => (unit === "F" ? (temp * 9) / 5 + 32 : temp);
    const suffix = unit === "F" ? "F" : "C";
    const speedUnit = unit === "F" ? "mph" : "km/h";
    const visibilityUnit = unit === "F" ? "mi" : "km";

    const temp = convert(weatherData.temperature);
    const feels = convert(weatherData.feelsLike);
    const high = convert(weatherData.high);
    const low = convert(weatherData.low);
    const windSpeed = unit === "F" ? weatherData.windSpeed * 0.621371 : weatherData.windSpeed;
    const windGust = weatherData.windGust == null
        ? null
        : unit === "F"
            ? weatherData.windGust * 0.621371
            : weatherData.windGust;
    const visibility = unit === "F" ? weatherData.visibility * 0.621371 : weatherData.visibility;

    refs.cityName.textContent = weatherData.city;
    refs.temperature.textContent = `${Math.round(temp)}°${suffix}`;
    refs.conditions.textContent = weatherData.conditions;
    refs.humidity.textContent = `Humidity: ${Math.round(weatherData.humidity)}%`;
    refs.currentHl.textContent = `H: ${Math.round(high)}° L: ${Math.round(low)}°`;
    refs.currentFeels.textContent = `Feels like ${Math.round(feels)}°`;
    refs.currentUpdated.textContent = formatUpdated(weatherData.updatedEpoch);
    refs.currentIconWrap.replaceChildren(icon(weatherData.icon, "current-weather-icon"));

    refs.detailFeelsValue.textContent = `${Math.round(feels)}°${suffix}`;
    refs.detailFeelsNote.textContent = feelsLikeNote(weatherData.temperature, weatherData.feelsLike);

    refs.detailWindValue.textContent = `${Math.round(windSpeed)} ${speedUnit}`;
    refs.detailWindDir.textContent = degToCompass(weatherData.windDir);
    refs.detailWindNote.textContent = windGust == null
        ? "Gust data unavailable."
        : `Gusts up to ${Math.round(windGust)} ${speedUnit}.`;

    refs.detailHumidityValue.textContent = `${Math.round(weatherData.humidity)}%`;
    refs.humidityBarFill.style.width = `${clamp(weatherData.humidity, 0, 100)}%`;

    refs.detailPressureValue.textContent = `${Math.round(weatherData.pressure)} hPa`;
    refs.detailPressureNote.textContent = pressureNote(weatherData.pressure);

    refs.detailVisibilityValue.textContent = `${visibility.toFixed(visibility >= 10 ? 0 : 1)} ${visibilityUnit}`;
    refs.detailVisibilityNote.textContent = visibilityNote(weatherData.visibility);

    refs.detailUvValue.textContent = `${Math.round(weatherData.uvIndex)} / 11`;
    refs.uvBarFill.style.width = `${clamp((weatherData.uvIndex / 11) * 100, 0, 100)}%`;

    refs.hourlyTrack.replaceChildren(
        ...weatherData.hourly.map((item) =>
            buildHourlyItem({
                ...item,
                temp: convert(item.temp),
            })
        )
    );

    const rangeMin = weatherData.tempRange.min;
    const rangeMax = weatherData.tempRange.max;
    const span = Math.max(rangeMax - rangeMin, 1);

    refs.dailyLocation.textContent = shortCity(weatherData.city);
    refs.dailyList.replaceChildren(
        ...weatherData.daily.map((day) => {
            const minPct = ((day.tempMin - rangeMin) / span) * 80 + 5;
            const maxPct = ((day.tempMax - rangeMin) / span) * 80 + 15;
            return buildDailyRow({
                label: day.label,
                icon: day.icon,
                tempMin: convert(day.tempMin),
                tempMax: convert(day.tempMax),
                minPct,
                maxPct,
            });
        })
    );

    const aqi = weatherData.airQuality;
    refs.aqiBadge.textContent = aqi.status;
    refs.aqiBadge.dataset.status = aqi.status.toLowerCase();
    refs.aqiMessage.textContent = aqi.message;
    refs.aqiPm25.textContent = aqi.pm25;
    refs.aqiPm10.textContent = aqi.pm10;
    refs.aqiO3.textContent = aqi.o3;

    updateUnitToggle(unit);
}

export function updateUnitToggle(unit) {
    const button = document.querySelector("#unit-toggle");
    if (!button) return;

    button.querySelectorAll(".unit-option").forEach((option) => {
        option.classList.toggle("is-active", option.dataset.unit === unit);
    });
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

function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);

    Object.entries(attrs).forEach(([key, value]) => {
        if (value == null || value === false) return;

        if (key === "text") {
            node.textContent = value;
            return;
        }

        if (key === "class") {
            node.className = value;
            return;
        }

        if (key === "style" && typeof value === "string") {
            node.setAttribute("style", value);
            return;
        }

        node.setAttribute(key, value === true ? "" : value);
    });

    (Array.isArray(children) ? children : [children]).forEach((child) => {
        if (child == null) return;
        node.append(child);
    });

    return node;
}

function icon(name, className = "") {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.8");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");
    if (className) svg.setAttribute("class", className);

    const paths = ICON_PATHS[normalizeIcon(name)] || ICON_PATHS["partly-cloudy-day"];
    paths.forEach((d) => {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", d);
        svg.appendChild(path);
    });

    return svg;
}

function normalizeIcon(name) {
    if (!name) return "partly-cloudy-day";
    if (ICON_PATHS[name]) return name;

    if (name.includes("thunder")) return "rain";
    if (name.includes("rain") || name.includes("showers")) return "rain";
    if (name.includes("snow")) return "snow";
    if (name.includes("fog") || name.includes("haze")) return "fog";
    if (name.includes("wind")) return "wind";
    if (name.includes("clear-night") || name.includes("night")) return "clear-night";
    if (name.includes("clear")) return "clear-day";
    if (name.includes("cloud")) return "partly-cloudy-day";
    return "partly-cloudy-day";
}

const ICON_PATHS = {
    cloud: [
        "M7 18h10a4 4 0 0 0 .5-7.97A6 6 0 0 0 6.1 12.2 3.5 3.5 0 0 0 7 18z",
    ],
    "arrow-right": ["M5 12h14", "M13 6l6 6-6 6"],
    clock: [
        "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
        "M12 7v5l3 2",
    ],
    calendar: [
        "M7 3v3",
        "M17 3v3",
        "M4 8h16",
        "M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z",
    ],
    waves: [
        "M3 8c2 2 4 2 6 0s4-2 6 0 4 2 6 0",
        "M3 14c2 2 4 2 6 0s4-2 6 0 4 2 6 0",
        "M3 20c2 2 4 2 6 0s4-2 6 0 4 2 6 0",
    ],
    thermometer: [
        "M14 14.76V5a2 2 0 0 0-4 0v9.76a4 4 0 1 0 4 0z",
    ],
    wind: [
        "M3 8h11a3 3 0 1 0-3-3",
        "M3 12h14a3 3 0 1 1-3 3",
        "M3 16h8a3 3 0 1 1-3 3",
    ],
    droplet: [
        "M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z",
    ],
    gauge: [
        "M12 15l3-3",
        "M5.5 17.5A8 8 0 1 1 18.5 17.5",
    ],
    eye: [
        "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z",
        "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
    ],
    sun: [
        "M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z",
        "M12 1v2",
        "M12 21v2",
        "M4.2 4.2l1.4 1.4",
        "M18.4 18.4l1.4 1.4",
        "M1 12h2",
        "M21 12h2",
        "M4.2 19.8l1.4-1.4",
        "M18.4 5.6l1.4-1.4",
    ],
    "clear-day": [
        "M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z",
        "M12 1v2",
        "M12 21v2",
        "M4.2 4.2l1.4 1.4",
        "M18.4 18.4l1.4 1.4",
        "M1 12h2",
        "M21 12h2",
        "M4.2 19.8l1.4-1.4",
        "M18.4 5.6l1.4-1.4",
    ],
    "clear-night": [
        "M21 14.5A8.5 8.5 0 1 1 9.5 3 7 7 0 0 0 21 14.5z",
    ],
    "partly-cloudy-day": [
        "M8 16h9a3.5 3.5 0 0 0 .4-7 5 5 0 0 0-9.5 1.6A3 3 0 0 0 8 16z",
        "M16 4v1.2",
        "M19.5 6.5l-.8.8",
        "M21 11h-1.2",
    ],
    "partly-cloudy-night": [
        "M8 17h9a3.5 3.5 0 0 0 .3-7 5 5 0 0 0-9.2 1.8A3 3 0 0 0 8 17z",
        "M18 4.5A4.5 4.5 0 0 1 14 9",
    ],
    cloudy: [
        "M7 18h10a4 4 0 0 0 .5-7.97A6 6 0 0 0 6.1 12.2 3.5 3.5 0 0 0 7 18z",
    ],
    rain: [
        "M7 15h10a4 4 0 0 0 .5-7.97A6 6 0 0 0 6.1 9.2 3.5 3.5 0 0 0 7 15z",
        "M9 18l-1 2",
        "M13 18l-1 2",
        "M17 18l-1 2",
    ],
    snow: [
        "M7 15h10a4 4 0 0 0 .5-7.97A6 6 0 0 0 6.1 9.2 3.5 3.5 0 0 0 7 15z",
        "M9.5 18v2",
        "M13 18v2",
        "M16.5 18v2",
    ],
    fog: [
        "M4 10h16",
        "M6 14h12",
        "M8 18h8",
        "M7 6h10a4 4 0 0 0-.2-1.5A5 5 0 0 0 7.5 6",
    ],
};

function degToCompass(deg = 0) {
    const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    const index = Math.round(deg / 22.5) % 16;
    return directions[index];
}

function feelsLikeNote(temp, feelsLike) {
    const diff = feelsLike - temp;
    if (Math.abs(diff) < 0.8) return "Similar to the actual temperature.";
    if (diff < 0) return "Slightly cooler due to wind and conditions.";
    return "Feels a bit warmer than the air temperature.";
}

function pressureNote(pressure) {
    if (pressure >= 1020) return "High pressure — generally settled conditions.";
    if (pressure <= 1005) return "Lower pressure — weather may be more changeable.";
    return "Stable barometric trend.";
}

function visibilityNote(visibility) {
    if (visibility >= 10) return "Clear horizon conditions.";
    if (visibility >= 5) return "Good visibility with slight haze.";
    return "Reduced visibility — take care outdoors.";
}

function formatUpdated(epoch) {
    if (!epoch) return "Updated just now";
    const mins = Math.max(0, Math.round((Date.now() / 1000 - epoch) / 60));
    if (mins <= 1) return "Updated just now";
    if (mins < 60) return `Updated ${mins} mins ago`;
    const hours = Math.round(mins / 60);
    return `Updated ${hours} hr${hours === 1 ? "" : "s"} ago`;
}

function shortCity(city) {
    return city.split(",")[0].trim();
}

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}
