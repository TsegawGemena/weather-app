import {listenForSearch,displayWeather,showLoading} from "./dom.js";
import {getWeather} from "./api.js";
import {processWeatherData} from "./weather.js";


export function initializeApp(){
    listenForSearch(async(city)=>{
        showLoading();
        const data= await getWeather(city);
        const weatherData=processWeatherData(data);
        displayWeather(weatherData);



    });


}