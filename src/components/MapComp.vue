<template>
  <div class="map">
    <map id="Map" :latitude="latitude" :longitude="longitude" style="width: 100%; height: 100%" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
defineOptions({
  name: 'MapComp',
})
const mapCtx = ref(null)
const latitude = ref(39.909)
const longitude = ref(116.39742)
onMounted(() => {
  mapCtx.value = wx.createMapContext('myMap')
})
</script>

<style scoped lang="scss">
.map {
  width: 100%;
  height: 100%;
}
</style>
