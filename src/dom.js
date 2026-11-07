export function displayWeather(weatherData){
    const app = document.querySelector("#app");

    const citySection= document.createElement("section");
    citySection.classList.add("city-section");

    const cityName=document.createElement("div");
    cityName.classList.add("city-name");

    cityName.textContent=weatherData.cityName;




    
    
}