export async function getWeather(location){
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}?key=DT5YPSDRK2TA2CLU83TGUED36&unitGroup=metric`;
    const response=await fetch(url);

    if (!response.ok){
        const errorData = await response.text();
        
        throw new Error(`API Error ${response.status}: ${errorData}`);


    }
    const data = await response.json();
    console.log(data);
    return data;
}