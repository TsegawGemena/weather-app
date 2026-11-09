export function processWeatherData(data) {
    const current = data.currentConditions;
    const days = data.days || [];
    const today = days[0] || {};

    const hourly = buildHourlyForecast(days, current);
    const daily = days.slice(0, 5).map((day, index) => ({
        label: index === 0 ? "Today" : formatWeekday(day.datetime),
        icon: day.icon,
        tempMin: day.tempmin,
        tempMax: day.tempmax,
        conditions: day.conditions,
    }));

    const tempRange = daily.reduce(
        (acc, day) => ({
            min: Math.min(acc.min, day.tempMin),
            max: Math.max(acc.max, day.tempMax),
        }),
        { min: Infinity, max: -Infinity }
    );

    return {
        city: data.resolvedAddress,
        temperature: current.temp,
        humidity: current.humidity,
        conditions: current.conditions,
        feelsLike: current.feelslike,
        windSpeed: current.windspeed,
        windGust: current.windgust,
        windDir: current.winddir,
        pressure: current.pressure,
        visibility: current.visibility,
        uvIndex: current.uvindex,
        precipProb: current.precipprob,
        icon: current.icon,
        high: today.tempmax,
        low: today.tempmin,
        updatedEpoch: current.datetimeEpoch,
        timezone: data.timezone,
        description: data.description || today.description || "",
        hourly,
        daily,
        tempRange,
        airQuality: estimateAirQuality(current),
    };
}

function buildHourlyForecast(days, current) {
    const hours = [];

    for (const day of days) {
        if (!day.hours) continue;
        for (const hour of day.hours) {
            hours.push({
                ...hour,
                dayDate: day.datetime,
            });
        }
    }

    const nowEpoch = current.datetimeEpoch;
    const upcoming = hours.filter((hour) => hour.datetimeEpoch >= nowEpoch - 3600);

    const selected = upcoming.slice(0, 7).map((hour, index) => ({
        label: index === 0 ? "Now" : hour.datetime.slice(0, 5),
        temp: hour.temp,
        precipProb: hour.precipprob ?? 0,
        icon: hour.icon,
        isNow: index === 0,
    }));

    return selected;
}

function formatWeekday(dateString) {
    const date = new Date(`${dateString}T12:00:00`);
    return date.toLocaleDateString("en-US", { weekday: "short" });
}

function estimateAirQuality(current) {
    const visibility = current.visibility ?? 10;
    let status = "Good";
    let message =
        "Air quality is considered satisfactory, and air pollution poses little or no risk.";

    if (visibility < 5) {
        status = "Moderate";
        message =
            "Air quality is acceptable; sensitive groups may notice minor effects outdoors.";
    } else if (visibility < 2) {
        status = "Unhealthy";
        message =
            "Air quality may be unhealthy for sensitive groups. Limit prolonged outdoor activity.";
    }

    const factor = Math.max(0.4, Math.min(1.4, 10 / Math.max(visibility, 1)));

    return {
        status,
        message,
        pm25: Number((6.4 * factor).toFixed(1)),
        pm10: Number((12.1 * factor).toFixed(1)),
        o3: Number((24.8 * factor).toFixed(1)),
    };
}
