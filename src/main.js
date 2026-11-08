import {listenForSearch,displayWeather,showLoading,hideLoading,showError,clearError} from "./dom.js";
import {getWeather} from "./api.js";
import {processWeatherData} from "./weather.js";


export function initializeApp(){
    listenForSearch(async(city)=>{
        clearError();
        showLoading();
        try{
            const data= await getWeather(city);
            const weatherData=processWeatherData(data);
            displayWeather(weatherData);
        }
        catch(error){
            console.error("Failed to fetch weather:",error);
            showError(error.message);

        }
        finally{
            hideLoading();
        }




    });


}