import axios from 'axios'


const getWeatherData = async (lat, lon, id = '') => {
    try {
        const weatherData = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_OPEN_WEATHER_KEY}&units=metric`)

        // cal current date & time
        const localOffset = new Date().getTimezoneOffset() * 60000;
        const utc = weatherData.data.dt * 1000 + localOffset;
        weatherData.data.currentTime = utc + 1000 * weatherData.data.timezone;
        weatherData.data.currentId = id;
        
        // Flicker Delay
        await new Promise(res => setTimeout(res, 500))

        return weatherData.data
    } catch (error) {
        console.log(error);
    }
}

const getWeatherDataWeekly = async (lat, lon) => {
    try {
        const weatherDataWeekly = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_OPEN_WEATHER_KEY}&units=metric`)

        return weatherDataWeekly.data
    } catch (error) {
        console.log(error);
    }
}

const getCities = async (savedCities) => {
    if(localStorage.getItem('savedCities')){
        savedCities.value = JSON.parse(localStorage.getItem('savedCities'))

        const requests = []

        savedCities.value.forEach((city) => {
            const {lat, lon} = city.coords
            const {id} = city
            requests.push(getWeatherData(lat, lon, id))
        })

        const weatherData = await Promise.all(requests)

        // Flicker Delay
        await new Promise(res => setTimeout(res, 500))

        return weatherData

    }

    
}

export {getWeatherData, getWeatherDataWeekly, getCities}