var cityFormEl = document.getElementById("cityInput")
var inputFormEl = document.getElementById("inputForm")
var searchEl = document.getElementById("searchBtn")
var cityHistoryEl = document.getElementById("cityHistory")
var fiveDayContainerEl = document.getElementById("fiveDayContainer")
var cityContainerEl = document.getElementById("cityContainer");

var cities = []
var apiKey = '2680ad26bff39078c959033e473da2b5'

var getCity = () => {
    var loadCity = localStorage.getItem("cities")
    if(!loadCity) {
        return false;
    }

    loadCity = JSON.parse(loadCity);

    for (var i=0; i < loadCity.length; i++) {
        displayCities(loadCity[i])
        cities.push(loadCity[i])
    }
}

var saveCity = () => {
    localStorage.setItem("cities", JSON.stringify(cities));
}

var displayCities = (city) => {
    var cityCardEl = document.createElement("div");
    var cityCardTitleEl = document.createElement("div")
    cityCardEl.setAttribute("class", "card")
    cityCardTitleEl = setAttribute("class", "card-body searchCity")
    cityCardTitleEl.textContent = city;

    cityCardEl.appendChild(cityCardTitleEl)
    cityCardEl.addEventListener("click", function() {
        getCityData(city)
    });
    
    cityHistoryEl.appendChild(cityCardEl)

}

var displayCityData = function(city, data) {
    var temp = Math.round(data.current.temp);
    var humidity = Math.round(data.current.humidity);
    var uvIndex = data.current.uvi;
    var windSpeed = data.current.wind_speed
    var icon = data.current.weather[0].icon;

    cityContainerEl.textContent = "";
    cityContainerEl.setAttribute("class", "m-3 border col-10 text-center")
    var cityHeader = document.createElement("div")
    var cityHeaderDate = document.createElement("h2")
    var currentDate = moment().format("L")
    var imageIcon = document.createElement("img")
    imageIcon.setAttribute("src", '')
    imageIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + iconCurrent + "@2x.png")
    cityHeaderDate.textContent = city + "   (" + currentDate + ")"

    cityHeader.appendChild(cityHeaderDate)
    cityHeader.appendChild(imageIcon)
    cityContainerEl.appendChild(cityHeader)

    var divCurrent = document.createElement("div")
    var tempEl = document.createElement("p");
    var humidityEl = document.createElement("p");
    var windSpeedEl = document.createElement("p");
    var uvIndexEl = document.createElement ("p");
    var uvIndexColorEl = document.createElement("span")
    uvIndexColorEl.textContent = uvIndex

    if (uvIndex <= 4) {
        uvIndexColorEl.setAttribute("class", "bg-success  p-2")
    } else if (uvIndex <= 8) {
        uvIndexColorEl.setAttribute("class","bg-warning  p-2")
    } else {
        uvIndexColorEl.setAttribute("class", "bg-danger  p-2")
    }

    tempEl.textContent = "Temperate: " + temp + "°F"
    humidityEl.textContent = "Humidity: " + humidity + "%"
    windSpeedEl.textContent = "Wind Speed: " + windSpeed + " Mph"
    uvIndexEl.textContent = "UV Index: ";

    uvIndexEl.appendChild(uvIndexColorEl)
    divCurrent.appendChild(tempEl);
    divCurrent.appendChild(humidityEl);
    divCurrent.appendChild(windSpeedEl);
    divCurrent.appendChild(uvIndexEl);

    currentContainerEl.appendChild(divCurrent);
};

var displayForecast = function(data) {
    fiveDayContainerEl.textContent = "";
    var forecastHead = document.getElementById("fiveDayForecast")
    forecastHead.textContent = "Your Five Day Forecast: "

    for (var i=1; i < 5; i++) {
        var forecastTemp = Math.round(data.daily[i].temp.day);
        var forecastHumidity = data.daily[i].humidity;
        var forecastIcon = data.daily[i].weather.icon;


        // create variables/elements to place weather and icon information
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

    // Append the above information into the card created
        cardBodyEl.appendChild(cardDateEl)
        cardBodyEl.appendChild(cardIconEl)
        cardBodyEl.appendChild(cardTempEl)
        cardBodyEl.appendChild(cardHumidEl)
    
        cardEl.appendChild(cardBodyEl);
        fiveDayContainerEl.appendChild(cardEl);
    
 
        cityFormEl.reset()
    }
    
};

var getCityData = function(city) {
    event.preventDefault();

    // API request and and variables for data set from API pull
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apikey;
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
        var lat = data.coord.lat;
        var lon = data.coord.lon;
        var cityName = data.name
        var searchHistory = cities.includes(cityName)
        if (!searchHistory) {
            cities.push(cityName)
            saveCity()
            displayCities(cityName)
        }

        getWeather(cityName, lat, lon);
        
        });

        } else {
            cityFormEl.reset();
        }
    });
}

var getWeather = (city, lat, lon) => {

    var forecastUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=minutely,hourly&appid=" + apiKey;
    
    fetch(forecastUrl).then(function(response) {
        response.json().then(function(data) {
        
            displayCityData(city, data);
            displayForecast(data);
        });
    });
}

cityFormEl.addEventListener("submit", function() {
    cityForm = cityInputEl.value.trim();
    getCityData(cityForm);
});


