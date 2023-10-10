const API_KEY = `bf7f12519a37142b804a97a0475dd87c`;
const userTab = document.querySelector('.your-weather-tab');
const searchTab = document.querySelector('.search-weather-tab');
const grantLocation = document.querySelector('.grant-loc');
const searchCity = document.querySelector('.search-city');
const loadingScreen = document.querySelector('.loading-screen')
const userInfoContainer = document.querySelector('.user-info-container');
const accessButton = document.querySelector('.access-btn');
const searchCityInput = document.querySelector('.search-city-input');
const notFound = document.querySelector('.not-found');

let currentTab = userTab;
currentTab.classList.add('active');
getFromSessionStorage();

function switchTab(newTab) {
    if (currentTab != newTab) {
        currentTab.classList.remove('active');
        notFound.classList.remove('active');
        currentTab = newTab;
        currentTab.classList.add('active');

        if (!searchCity.classList.contains('active')) {
            userInfoContainer.classList.remove('active');
            grantLocation.classList.remove('active');
            searchCity.classList.add('active');
        } else {
            userInfoContainer.classList.remove('active');
            searchCity.classList.remove('active');

            getFromSessionStorage();
        }
    }
}


userTab.addEventListener('click', () => {
    switchTab(userTab);
});
searchTab.addEventListener('click', () => {
    switchTab(searchTab);
});

accessButton.addEventListener('click',getLocation);

function getFromSessionStorage() {
    let userCoordinates = sessionStorage.getItem("user-coordinates");
    if (!userCoordinates) {
        grantLocation.classList.add('active');
    }
    else {
        let coordinates = JSON.parse(userCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert('location not supported');
    }
}
function showPosition(position) {
    let coordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(coordinates));
    fetchUserWeatherInfo(coordinates);
}



searchCity.addEventListener('submit', (e) => {
    e.preventDefault();
    let cityName = searchCityInput.value;
    notFound.classList.remove('active');
    if (cityName === "") {
        userInfoContainer.classList.remove('active');
        notFound.classList.remove('active');
        return;
    } else {
        fetchSearchWeatherInfo(cityName);
    }

});

async function fetchUserWeatherInfo(coordiantes) {
    let { lat, lon } = coordiantes;
    grantLocation.classList.remove('active');
    loadingScreen.classList.add('active');
    try {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        let data = await response.json();

        loadingScreen.classList.remove('active');
        RenderWeather(data);
    }
    catch (error) {
        notFound.classList.add('active');
        // alert(error);
    }
}


async function fetchSearchWeatherInfo(city_name) {
    loadingScreen.classList.add('active');
    grantLocation.classList.remove('active');
    userInfoContainer.classList.remove('active');
    try {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${API_KEY}`);
        let data = await response.json();

        loadingScreen.classList.remove('active');
        RenderWeather(data);
    } catch (error) {
        notFound.classList.add('active');
        // alert(error);
    }
}

function RenderWeather(data) {

    let cityName = document.querySelector("[city-name]");
    let countryIcon = document.querySelector("[country-icon]");
    let desc = document.querySelector("[weather-desc]");
    let weatherIcon = document.querySelector("[weather-icon]");
    let temp = document.querySelector("[temp]");
    let windspeed = document.querySelector("[wind-val]");
    let humidity = document.querySelector("[humidity-val]");
    let cloudiness = document.querySelector("[cloud-val]");
console.log(data);
    if(data?.name){
        cityName.innerText = data?.name;
        countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
        desc.innerText = data?.weather?.[0]?.description;
        weatherIcon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
        temp.innerText = `${(data?.main?.temp - 273).toFixed(2)} °C`;
        windspeed.innerText = `${data?.wind?.speed} m/s`;
        humidity.innerText = `${data?.main?.humidity}%`;
        cloudiness.innerText = `${data?.clouds?.all}%`;

        userInfoContainer.classList.add('active');
    } 
    else{
        notFound.classList.add('active');
    }

}
