<template>
  <div class="map">
    <map
      id="Map"
      :latitude="latitude"
      :longitude="longitude"
      :markers="markers"
      style="width: 100%; height: 142px"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
defineOptions({
  name: 'MapComp',
})
const mapCtx = ref(null)
const latitude = ref(null)
const longitude = ref(null)
const markers = ref([])

const getLocation = () => {
  wx.getLocation({
    success: (res) => {
      latitude.value = res.latitude
      longitude.value = res.longitude
      const markerObj = {
        id: 1,
        iconPath: '/static/images/userAvatar.png',
        width: 24,
        height: 24,
        latitude: res.latitude,
        longitude: res.longitude,
      }
      const arr = [markerObj]
      markers.value = arr
    },
  })
}
onMounted(() => {
  mapCtx.value = wx.createMapContext('myMap')
  getLocation()
})
</script>

<style scoped lang="scss">
.map {
  width: 100%;
  height: 100%;
}
</style>
