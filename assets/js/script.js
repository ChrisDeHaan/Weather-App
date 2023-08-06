var cityNameInput = document.getElementById("inputCityName")
var cityButtonContainer = document.getElementById("cityButtons")
var searchButton = document.getElementById('searchButton')
var fiveDayForecastContainer = document.getElementById('5dayForecastContainer')

//localStorage variables
var localStorageContent = localStorage.getItem('cities')
var cityObjArray = JSON.parse(localStorageContent) || []

//I want to generate any buttons in localStorage on page load
buttonGenerator();

//event listener for getting the input field value and calling my functions
cityNameInput.addEventListener( "keydown", (event) => {
    // event.preventDefault();
    if (event.code === "Enter") {
        event.preventDefault();
        cityNameInput = event.target.value;
        getLocation(cityNameInput);
        document.getElementById('inputCityName').value = ''
    }
})

//event listener for previous city buttons to display their weather data
cityButtonContainer.addEventListener( "click", (event) => {
    if (event.target.value !== undefined) {
        var buttonClicked = event.target.textContent
        getLocation(buttonClicked)
    }

})

//function for getting the lat, lon values for a city name and storing those values
function getLocation(cityNameInput) { 
    var apiKey = 'f1b45b757f5516eb0176dce94ee00898'
    var geoCodingCall = `https://api.openweathermap.org/geo/1.0/direct?q=${cityNameInput}&limit=1&appid=${apiKey}`

    fetch(geoCodingCall)
    .then( (response) => {return response.json()})
    .then( (data) => {
        if (data[0] === undefined) {
            alert ('no cities found')
            buttonGenerator()
            return;
        } else {
        var lat = data[0].lat
        var lon = data[0].lon
        var cityName = data[0].name

        cityStorage(cityName)
        getData(lat, lon)
        }
    })
}

//function for getting the weather data of a city using lat and lon
function getData(lat, lon) {
    var apiKey = 'f1b45b757f5516eb0176dce94ee00898'
    var weatherCall = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`

    fetch(weatherCall)
    .then( (response) => {return response.json()})
    .then( (data) => {
        fiveDayForecastContainer.innerHTML = ''

        //for loop to iterate through the array and create an element for each day. the data is in 3 hour increments over 5 days, so 40 objects total. I'll take the weather at noon for each day.
        for (i = 4; i < 40; i += 8) {
        var date = data.list[i].dt_txt;
            date = date.slice(0,10) //we'll lop off the time of day since it isn't needed for a daily forecast
        var icon = data.list[i].weather[0].icon;
        var temp = data.list[i].main.feels_like;
        var wind = data.list[i].wind.speed;
        var humidity = data.list[i].main.humidity;

        fiveDayForecastContainer.innerHTML += `
        <div class="col-lg-2 col-12 bg-light border border-3 border-secondary rounded p-2 my-3">
        <p class="h4 text-center">${date}</p>
        <img src='http://openweathermap.org/img/w/${icon}.png' class="mx-auto d-block"></img>
        <p>Temp: ${temp}</p>
        <p>Wind: ${wind} MPH</p>
        <p>Humidity: ${humidity}%</p>
        </div>
        `}
    })
}

//function for the localStorage of city names and lat/lon as well as generating the buttons
function cityStorage (cityName) {
    var addCityObject = {
        name: cityName
    }

    cityObjArray.push(addCityObject)

    if (cityObjArray.length > 5) {
        cityObjArray.shift()
    }

    buttonGenerator()

    localStorage.setItem('cities', JSON.stringify(cityObjArray))
}

//function for generating the buttons
function buttonGenerator () {
    cityObjArray.reverse() //I want the buttons to appear with the most recent addition on top
    cityButtonContainer.innerHTML = '' //need to clear the buttons on page load
    for (var i = 0; i < cityObjArray.length; i++) {
        cityButtonContainer.innerHTML += `
        <button type="button" class="btn btn-secondary form-control py-2 my-2">${cityObjArray[i].name}</button>
        `
    }
    cityObjArray.reverse() //flip it back
}