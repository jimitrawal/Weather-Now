const apiKey = "cef126d4aa46727be34b90a87d0fbe3a";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?";
const searchBox = document.querySelector(".searchbar input");
const searchButton = document.querySelector(".searchbar button")
const weatherIcon = document.querySelector(".weather-icon");
const currentLocationButton = document.querySelector("#current-location-btn");

async function currentLocation(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const response = await fetch(apiUrl + 'lat=' + lat + '&lon=' + lon + '&appid=' + apiKey);
        const data = await response.json();                    
        checkWeather(data.name);
    });
    } else {
        showError('Geolocation is not supported by this browser.');
    }
}

async function getTime(lat,long,time){
    const response = await fetch (`https://api.sunrisesunset.io/json?lat=${lat}&lng=${long}`);
    const data = await response.json();  
    let sun;
    if(time == "sunrise"){
        sun = data.results.sunrise;        
    }else{
        sun = data.results.sunset;
    }
    if (!sun) {
        return "--:--"; 
    }

    const [hours, minutes] = sun.split(':');
    const formattedTime = `${hours}:${minutes}`;
    return formattedTime;
}

async function checkWeather(city){
    const response = await fetch(apiUrl + 'q=' + city + '&appid=' + apiKey + '&units=metric');
    if(response.status == 404){
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
    }else{
        document.querySelector(".error").style.display = "none";
        document.querySelector(".weather").style.display = "block";
        let data = await response.json();
        
        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".region").innerHTML = data.sys.country;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed*2 + " km/h";
        document.querySelector(".weather-status").innerHTML = data.weather[0].main;
        const sunriseTime = await getTime(data.coord.lat, data.coord.lon, "sunrise");
        const sunsetTime = await getTime(data.coord.lat, data.coord.lon, "sunset");
        document.querySelector(".sunrise").innerHTML = sunriseTime + ' AM';
        document.querySelector(".sunset").innerHTML = sunsetTime + ' PM';
                
        const currentTime = data.dt;
        if(currentTime >= data.sys.sunrise && currentTime <= data.sys.sunset){
            document.body.style.background = 'linear-gradient(rgb(104, 190, 233), #FFFFFF)';
            document.querySelector(".card").style.background = 'linear-gradient(rgb(16, 162, 235),rgb(0, 94, 255))';
            if(data.weather[0].main === "Clouds"){
                weatherIcon.src = "images/clouds.png" 
            }else if(data.weather[0].main === "Rain"){
                weatherIcon.src = "images/rain.png" 
            }else if(data.weather[0].main === "Thunderstorm"){
                weatherIcon.src = "images/thunderstorm.png" 
            }else if(data.weather[0].main === "Drizzle"){
                weatherIcon.src = "images/drizzle.png" 
            }else if(data.weather[0].main === "Clear"){
                   weatherIcon.src = "images/clear.png" 
            }else if(data.weather[0].main === "Snow"){
                weatherIcon.src = "images/snow.png" 
            }else{
                weatherIcon.src="images/fog-day.png"
            }
        }else if((currentTime > data.sys.sunrise && currentTime > data.sys.sunset) || (currentTime < data.sys.sunrise && currentTime < data.sys.sunset)){
            document.body.style.background = 'linear-gradient(#0A2342, #000000)';
            document.querySelector(".card").style.background = '#01274d';
            document.querySelector(".card").style.background = '0 4px 8px rgba(0, 0, 0, 0.2)';
            if(data.weather[0].main === "Clouds"){
               weatherIcon.src = "images/cloud.png" 
            }else if(data.weather[0].main === "Rain"){
                weatherIcon.src = "images/rainy-night-2.png" 
            }else if(data.weather[0].main === "Thunderstorm"){
                weatherIcon.src = "images/rainy-night-3.png" 
            }else if(data.weather[0].main === "Drizzle"){
               weatherIcon.src = "images/rainy-night-2.png" 
            }else if(data.weather[0].main === "Clear"){
                weatherIcon.src = "images/moon.png" 
            }else if(data.weather[0].main === "Snow"){
                weatherIcon.src = "images/rainy-night.png" 
            }else{
                weatherIcon.src="images/fog-night.png"
            }
        }
    }
}
        
currentLocationButton.addEventListener("click",currentLocation);
searchButton.addEventListener("click", ()=>{
    checkWeather(searchBox.value);
});