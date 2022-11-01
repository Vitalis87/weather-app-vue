<template>
  <main class="container text-white">
    <div class="pt-4 mb-8 relative">
      <input v-model="searchQuery" @input="getSearchResults" type="text" placeholder="Search for a city or state"
        class="py-2 px-1 w-full bg-transparent border-b focus:border-weather-secondary focus:outline-none focus:shadow-[0px_1px_0_0_#004E71]" />
      <ul v-if="cityResults" class="absolute bg-weather-secondary text-white w-full shadow-md py-2 px-1 top-[66px]">
        <p class="py-2" v-if="searchError">Sorry, something went wrong, please try again</p>
        <template v-else>
          <li v-for="result in cityResults" @click="previewCity(result)" class="py-2 cursor-pointer">
            {{ result.name }}, {{ result.state }}</li>
        </template>
      </ul>
    </div>
    <div class="flex flex-col gap-4">
      <Suspense>
        <CityList/>
        <template #fallback>
          <CityCardSkeleton/>
        </template>
      </Suspense>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import CityList from '../components/CityList.vue'
import CityCardSkeleton from '../components/CityCardSkeleton.vue'
import {uid} from 'uid'


const searchQuery = ref('')
const cityResults = ref(null)
const searchError = ref(null)


const router = useRouter()
const previewCity = (cityResults) => {
  const { country, name, lat, lon } = cityResults

  router.push({
    name: 'cityView',
    params: { state: country, city: name },
    query: {
      id: uid(),
      lat,
      lon,
      preview: true
    }
  })
}


const getSearchResults = async () => {
  if (searchQuery.value !== '') {
    try {
      const results = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${searchQuery.value}&limit=5&appid=${import.meta.env.VITE_OPEN_WEATHER_KEY}`)
      cityResults.value = results.data.reduce((a, c) => (a.map(e => e.state).includes(c.state) ? a : [...a, c]), [])
      searchError.value = false
    } catch {
      searchError.value = true
    }
    return;
  }
  cityResults.value = null
}
</script>

