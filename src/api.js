export async function getWeather(location){
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}?key=DT5YPSDRK2TA2CLU83TGUED36$unit=metric`;
    const reponse=await fetch(url);

    if (!response.ok){
        throw new error("failed to fetch weather data");

    }
    const data = await response.json();
    console.log(data);
    return data;
}