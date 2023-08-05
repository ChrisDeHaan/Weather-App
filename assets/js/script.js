var cityNameInput = document.getElementById("inputCityName")
var cityButtonContainer = document.getElementById("cityButtons")
var searchButton = document.getElementById('searchButton')

//localStorage variables
var localStorageContent = localStorage.getItem('cities')
var cityObjArray = JSON.parse(localStorageContent) || []

//I want to generate any buttons in localStorage on page load
buttonGenerator();

//eventListener for getting the input field value and calling my functions
cityNameInput.addEventListener( "keydown", (event) => {
    // event.preventDefault();
    if (event.code === "Enter") {
        event.preventDefault();
        cityNameInput = event.target.value;
        getLocation(cityNameInput);
        document.getElementById('inputCityName').value = ''
    }
})

//function for getting the lat, lon values for a city name and storing those values
function getLocation(cityNameInput) { 
    var apiKey = 'f1b45b757f5516eb0176dce94ee00898'
    var geoCodingCall = `http://api.openweathermap.org/geo/1.0/direct?q=${cityNameInput}&limit=1&appid=${apiKey}`

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

        console.log(lat, lon, cityName)
        cityStorage(lat, lon, cityName)
        getData(lat, lon)
        }
    })
}

//function for getting the weather data of a city using lat and lon
function getData(lat, lon) {
    var apiKey = 'f1b45b757f5516eb0176dce94ee00898'
    var weatherCall = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`

    fetch(weatherCall)
    .then( (response) => {return response.json()})
    .then( (data) => {console.log (data)})
}

//function for the localStorage of city names and lat/lon as well as generating the buttons
function cityStorage (lat, lon, cityName) {
    var addCityObject = {
        name: cityName,
        lat: lat,
        lon: lon
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