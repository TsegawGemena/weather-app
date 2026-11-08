const searchForm = document.querySelector("#search form");
const cityInput = document.querySelector("#city");
const app = document.querySelector("#app");

export function listenForSearch(callback){
    searchForm.addEventListener("submit",(event)=>{
        event.preventDefault();

        const city = cityInput.value.trim();
        if(city){
            callback(city);

        }

    });
}


export function displayWeather(weatherData){
    
    // const citySection= document.createElement("section");
    // citySection.classList.add("city-section");

    // const cityName=document.createElement("div");
    // cityName.classList.add("city-name");

    // cityName.textContent=weatherData.cityName;
    const  city = document.querySelector(".city-name");
    const temperature = document.querySelector(".temperature");
    const conditions = document.querySelector(".conditions");
    const humidity =document.querySelector(".humidity");

    city.textContent = weatherData.city;
    temperature.textContent =`${weatherData.temperature}°C`;
    conditions.textContent = weatherData.conditions;
    humidity.textContent = `Humidity: ${weatherData.humidity}%`;
    
}
export function showLoading(){
    const app = document.querySelector("#app");
    app.textContent="Loading weather...";

}
export function hideLoading(){
    const loading = app.querySelector("loading");
    loading.textContent="";
   

}