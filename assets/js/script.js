var cityNameInput = document.getElementById("inputCityName")
var cityButtonContainer = document.getElementById("cityButtons")
var searchButton = document.getElementById('searchButton')
var fiveDayForecastContainer = document.getElementById('5dayForecastContainer')
var submitButton = document.getElementById('submitButton')

//current weather specific variables
var cwCity = document.getElementById('cwName')
var cwDate = document.getElementById('cwDate')
var cwTemp = document.getElementById('cwTemp')
var cwWind = document.getElementById('cwWind')
var cwHumidity = document.getElementById('cwHumidity')

//localStorage variables
var localStorageContent = localStorage.getItem('cities')
var cityObjArray = JSON.parse(localStorageContent) || []

//I want to generate any buttons in localStorage on page load
buttonGenerator();

//event listener for pc users who press enter, getting the input field value and calling my functions
cityNameInput.addEventListener("keydown", (event) => {
    if (event.code === "Enter") {
        event.preventDefault();
        cityNameInput = event.target.value;
        getLocation(cityNameInput);
        document.getElementById('inputCityName').value = ''
    }
})

//event listener for users who press the submit button
submitButton.addEventListener("click", (event) => {
    if (document.getElementById("inputCityName").value === '') {
        return;
    } else {
        event.preventDefault();
        cityNameInput = document.getElementById("inputCityName").value
        console.log (cityNameInput)
        getLocation(cityNameInput)
    }
})

//event listener for previous city buttons to display their weather data
cityButtonContainer.addEventListener("click", (event) => {
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
        .then((response) => { return response.json() })
        .then((data) => {
            if (data[0] === undefined) {
                alert('no cities found')
                buttonGenerator()
                return;
            } else {
                var lat = data[0].lat
                var lon = data[0].lon
                var cityName = data[0].name

                cityStorage(cityName)
                displayData(lat, lon)
            }
        })
}

//function for getting the weather data of a city using lat and lon
function displayData(lat, lon) {
    var apiKey = 'f1b45b757f5516eb0176dce94ee00898'
    var futureWeatherCall = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
    var currentWeatherCall = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`

    //fetch request for the current weather
    fetch(currentWeatherCall)
        .then((response) => { return response.json() })
        .then((data) => {
            cwCity.innerHTML = `<strong>${data.name}</strong><img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png">`
            cwDate.innerHTML = `<strong>${dateGenerator(data.dt)}</strong>`
            cwTemp.textContent = `Temperature: ${Math.round(data.main.temp)}° F` //round to nearest whole integer
            cwWind.textContent = `Wind: ${data.wind.speed} MPH`
            cwHumidity.textContent = `Humidity: ${data.main.humidity}%`
        })

    //fetch request for the 5 day forecast
    fetch(futureWeatherCall)
        .then((response) => { return response.json() })
        .then((data) => {
            fiveDayForecastContainer.innerHTML = ''

            //for loop to iterate through the array and create an element for each day. the data is in 3 hour increments over 5 days, so 40 objects total. I'll take the weather at noon for each day.
            for (i = 4; i < 40; i += 8) {
                var date = data.list[i].dt;
                date = dateGenerator(date); //get a formatted date
                date = date.slice(0, 6) //remove the year from the date
                var icon = data.list[i].weather[0].icon;
                var temp = `${Math.round(data.list[i].main.feels_like)}° F`;
                var wind = data.list[i].wind.speed;
                var humidity = data.list[i].main.humidity;

                fiveDayForecastContainer.innerHTML += `
        <div class="col-lg-2 col-12 bg-light border border-3 border-secondary shadow rounded p-2 my-3">
        <p class="h3 text-center">${date}</p>
        <img src='http://openweathermap.org/img/wn/${icon}@2x.png' class="mx-auto d-block" alt='image of weather'></img>
        <p>Temp: ${temp}</p>
        <p>Wind: ${wind} MPH</p>
        <p>Humidity: ${humidity}%</p>
        </div>
        `}
        })
}

//function for the localStorage of city names and lat/lon as well as generating the buttons
function cityStorage(cityName) {
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
function buttonGenerator() {
    cityObjArray.reverse() //I want the buttons to appear with the most recent addition on top
    cityButtonContainer.innerHTML = '' //need to clear the buttons on page load
    for (var i = 0; i < cityObjArray.length; i++) {
        cityButtonContainer.innerHTML += `
        <button type="button" class="btn btn-secondary form-control py-2 my-2">${cityObjArray[i].name}</button>
        `
    }
    cityObjArray.reverse() //flip it back
}

//function to turn milliseconds into a readable date. 
//Part of this code was taken from https://www.geeksforgeeks.org/how-to-convert-milliseconds-to-date-in-javascript/
function dateGenerator(time) {
    var date = new Date(time * 1000); //code taken from Geeks for Geeks
    date = date.toString()
    date = date.slice(4, 15)
    return date
}
