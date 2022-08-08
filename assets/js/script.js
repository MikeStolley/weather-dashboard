var inputFormEl = document.getElementById("cityInput");
var cityFormEl = document.getElementById("cityForm");
var searchEl = document.getElementById("searchBtn");
var currentContainerEl = document.getElementById("currentContainer")
var forecastDisplayEl = document.getElementById("forecastDisplay")

var APIkey = "2680ad26bff39078c959033e473da2b5";
var cities = []

var getCity = function() {
    var citiesLoaded = localStorage.getItem("cities")
    if(!citiesLoaded) {
        return false;
    }
    
    citiesLoaded = JSON.parse(citiesLoaded);
    
    for (var i=0; i < citiesLoaded.length; i++) {
        displaySearchedCities(citiesLoaded[i])
        cities.push(citiesLoaded[i])
    }
}


var displaySearchedCities = function(city) {
    var cityCardEl = document.createElement("div");
    cityCardEl.setAttribute("class", "card");
    var cityCardNameEl = document.createElement("div");
    cityCardNameEl.setAttribute("class", "card-body searched-city");
    cityCardNameEl.textContent = city;
    
    cityCardEl.appendChild(cityCardNameEl)

    cityCardEl.addEventListener("click", function () {
        getCityData(city)
    });



}

var displayCurrentData = function(city, data) {

   
    var tempCurrent = Math.round(data.current.temp);
    var humidity = Math.round(data.current.humidity);
    var windSpeed = data.current.wind_speed;
    var uvIndex = data.current.uvi;
    var iconCurrent = data.current.weather[0].icon;


    currentContainerEl.textContent = ""
    currentContainerEl.setAttribute("class", "m-3 border col-10 text-center")
    var divCityHeader = document.createElement("div")
    var headerCityDate = document.createElement("h2");
    var currentdate = moment().format("L");
    var imageIcon = document.createElement("img");
    imageIcon.setAttribute('src', "") 
    imageIcon.setAttribute('src', "https://openweathermap.org/img/wn/" + iconCurrent + "@2x.png")
    headerCityDate.textContent = city + "   (" + currentdate + ")";


    divCityHeader.appendChild(headerCityDate)
    divCityHeader.appendChild(imageIcon)
    currentContainerEl.appendChild(divCityHeader)

  
    var divCurrent = document.createElement("div")
    var tempEl = document.createElement("p");
    var humidityEl = document.createElement("p");
    var windSpeedEl = document.createElement("p");
    var uvIndexEl = document.createElement ("p");
    var uvIndexColorEl = document.createElement("span")
    uvIndexColorEl.textContent = uvIndex
    
    
    tempEl.textContent = "Temperature: " + tempCurrent + "°F";
    humidityEl.textContent = "Humidity: " + humidity + "%";
    windSpeedEl.textContent = "Wind Speed: " + windSpeed + " MPH";
    uvIndexEl.textContent = "UV Index: ";

    uvIndexEl.appendChild(uvIndexColorEl)


    divCurrent.appendChild(tempEl);
    divCurrent.appendChild(humidityEl);
    divCurrent.appendChild(windSpeedEl);
    divCurrent.appendChild(uvIndexEl);

    currentContainerEl.appendChild(divCurrent);
    
};

var displayForecastData = function(data) {
   
    
    forecastDisplayEl.textContent = "";
    var forecastHeaderEl = document.getElementById("five-day");
    forecastHeaderEl.textContent = "5-day Forecast:"


    for (var i=1; i < 6; i++) {
        var tempForecast = Math.round(data.daily[i].temp.day);
        var humidityForecast = data.daily[i].humidity;
        var iconForecast = data.daily[i].weather[0].icon;
    
  
    var cardEl = document.createElement("div");
    cardEl.setAttribute("class","card col-xl-2 col-md-5 col-sm-10 mx-3 my-2 bg-primary text-white text-center");

    var cardBodyEl = document.createElement("div");
    cardBodyEl.setAttribute("class","card-body");

    var cardDateEl = document.createElement("h6");
    cardDateEl.textContent = moment().add(i, 'days').format("L");

    var cardIconEl = document.createElement("img");
    cardIconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + iconForecast + "@2x.png")

    var cardTempEl = document.createElement("p");
    cardTempEl.setAttribute("class", "card-text");
    cardTempEl.textContent = "Temperature:  " + tempForecast + "°F";

    var cardHumidEl = document.createElement("p")
    cardHumidEl.setAttribute("class", "card-text");
    cardHumidEl.textContent = "Humidity:  " + humidityForecast + "%";
    
    
    cardBodyEl.appendChild(cardDateEl)
    cardBodyEl.appendChild(cardIconEl)
    cardBodyEl.appendChild(cardTempEl)
    cardBodyEl.appendChild(cardHumidEl)
    
    
    cardEl.appendChild(cardBodyEl);
    forecastDisplayEl.appendChild(cardEl);
    
    cityFormEl.reset()

    }
};

var getCityData = function(city) {
    event.preventDefault();
    
   
    var cityInfoUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIkey;

  
    fetch(cityInfoUrl).then(function(response) {
     
        if (response.ok) {
            response.json().then(function(data) {
            var cityName = data.name;
            var latitude = data.coord.lat;
            var longitude = data.coord.lon;
            var prevSearch = cities.includes(cityName)


        getWeatherData(cityName,latitude,longitude);

    });
        }   
   });
};

var getWeatherData = function(city,latitude,longitude) { 

    var forecastUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial&exclude=minutely,hourly&appid=" + APIkey;
        
    fetch(forecastUrl).then(function(response) {
        response.json().then(function(data) {

        displayCurrentData(city, data);
        displayForecastData(data);

        });
    });
};


getCity()


cityFormEl.addEventListener("submit", function() {
    cityInput = inputFormEl.value.trim();
    getCityData(cityInput);
})

