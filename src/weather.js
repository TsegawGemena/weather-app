export function processWeatherData(data){
    return{
        city: data.resolvedAddress,
        temperature: data.currentConditions.temp,
        humidity: data.currentConditions.humidity,
        conditions: data.currentConditions.conditions,

    };
}