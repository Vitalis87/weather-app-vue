<template>
    <div class="flex flex-col flex-1 items-center">
        <!-- Banner -->
        <div v-if="route.query.preview" class="text-white p-4 bg-weather-secondary w-full text-center">
            <p class="">You are currently previewing this city, click the "+" icon to start tracking this city</p>
        </div>
        <!-- Weather Overview -->
        <div class="flex flex-col items-center text-white py-12">
            <h1 class="text-4xl mb-2">{{ route.params.city }}</h1>
            <p class="text-sm mb-12">
                {{
                        new Date(weatherData.currentTime).toLocaleDateString(
                            "en-us",
                            {
                                weekday: "short",
                                day: "2-digit",
                                month: "long",
                            }
                        )
                }}
                {{
                        new Date(weatherData.currentTime).toLocaleTimeString(
                            "en-us",
                            {
                                timeStyle: "short",
                            }
                        )
                }}
            </p>
            <p class="text-8xl mb-8">{{ Math.round(weatherData.main.temp) }}&deg;</p>
            <p>Feels like {{ Math.round(weatherData.main.feels_like) }}&deg;</p>
            <p class="capitalize">{{ weatherData.weather[0].description }}</p>
            <img class="w-[150px] h-auto"
                :src="`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`" />
        </div>
        <hr class="border border-white border-opacity-10 w-full" />

        <!-- Weekly Weather -->
        <div class="max-w-screen-md w-full py-12">
            <div class="mx-8 text-white">
                <h2 class="mb-4 text-xl">5 Day Forecast</h2>
                <div v-for="day in weatherDataWeekly.list" :key="day.dt" class="flex items-center">
                    <p class="flex-1">
                        {{
                                new Date(day.dt_txt).toLocaleDateString(
                                    "en-us",
                                    {
                                        weekday: "long",
                                    }
                                )
                        }}
                        -
                        {{
                                new Date(day.dt_txt).toLocaleTimeString(
                                    "en-us",
                                    {
                                        timeStyle: "short",
                                    }
                                )
                        }}
                    </p>

                    <img class="w-[50px] h-[50px] object-cover" :src="
                        `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`
                    " alt="" />
                    <div class="flex gap-2 flex-1 justify-end">
                        <p>H: {{ Math.round(day.main.temp_max) }}</p>
                        <p>L: {{ Math.round(day.main.temp_min) }}</p>
                        <p></p>
                    </div>
                </div>
            </div>
        </div>

        <div @click="removeCity" class="flex items-center gap-2 py-12 text-white cursor-pointer duration-150 hover:text-red-500">
           <TrashIcon class="w-[24px] h-[24px]"/>
           <p>Remove City</p>
        </div>
    </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import {getWeatherData, getWeatherDataWeekly} from '../api/requests'
import { TrashIcon } from "@heroicons/vue/24/solid";


const route = useRoute()
const router = useRouter()


const weatherData = await getWeatherData(route.query.lat, route.query.lon)
const weatherDataWeekly = await getWeatherDataWeekly(route.query.lat, route.query.lon)

const removeCity = () => {
  const cities = JSON.parse(localStorage.getItem('savedCities'))
  const updatedCities = cities.filter(city => city.id !== route.query.id)
  localStorage.setItem('savedCities', JSON.stringify(updatedCities))
  router.push({
    name: 'home'
  })
}

</script>
