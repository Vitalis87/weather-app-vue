<template>
    <div v-for="city in savedCities" :key="city.id">
      <CityCard :city="city" @click="goToCityView(city)"/>
    </div>

    <p v-if="savedCities?.length === 0 || savedCities?.length === undefined">No locations added. To start tracking a location, search in the field above.</p>
</template>

<script setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import {getCities} from '../api/requests'
import CityCard from '../components/CityCard.vue'


const savedCities = ref([])
const router = useRouter()

savedCities.value = await getCities(savedCities)

const goToCityView = (city) => {
 router.push({
    name: 'cityView',
    params: {state: city.sys.country, city: city.name},
    query: {id: city.currentId, lat: city.coord.lat, lon: city.coord.lon}
 })
}

</script>
