import {listenForSearch,displayWeather,showLoading,hideLoading} from "./dom.js";
import {getWeather} from "./api.js";
import {processWeatherData} from "./weather.js";


export function initializeApp(){
    listenForSearch(async(city)=>{
        showLoading();
        try{
            const data= await getWeather(city);
            const weatherData=processWeatherData(data);
            displayWeather(weatherData);
        }
        catch(error){
            console.error("Failed to fetch weather:",error);

        }
        finally{
            hideLoading();
        }




    });


}