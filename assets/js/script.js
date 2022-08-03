var cityFormEl = document.getElementById("cityInput")
var inputFormEl = document.getElementById("inputForm")
var searchEl = document.getElementById("searchBtn")
var cityHistoryEl = document.getElementById("cityHistory")
var fiveDayContainerEl = document.getElementById("fiveDayContainer")
var cityContainerEl = document.getElementById("cityContainer");

var city = []
var apiKey = '2680ad26bff39078c959033e473da2b5'

var getCity = () => {
    var loadCity = localStorage.getItem("city")
    if(!loadCity) {
        return false;
    }

    loadCity = JSON.parse(loadCity);

    for (var i=0; i < loadCity.length; i++) {
        displayCities(loadCity[i])
        cityHistoryEl.push(loadCity[i])
    }
}

var saveCity = () => {
    localStorage.setItem("city", JSON.stringify(cities));
}

var displaySearchedCity = (city) => {
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
