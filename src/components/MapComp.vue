<template>
  <div class="map">
    <ul class="map_list">
      <li
        :class="['map_list_item', selectBoxIdx === idx && 'map_list_item-act']"
        v-for="(item, idx) in bloodPackages"
        :key="idx"
        @click="selectBox(idx)"
      >
        <image
          class="map_list_item_img"
          :src="selectBoxIdx === idx ? mapBoxIconSel : mapBoxIcon"
          mode="scaleToFill"
        />
        <p :class="['map_list_item_text', selectBoxIdx === idx && 'map_list_item_text-act']">
          {{ item.code }}
        </p>
      </li>
    </ul>
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
import mapBoxIconSel from '@img/mapBoxIconSel.png'
import mapBoxIcon from '@img/mapBoxIcon.png'
defineOptions({
  name: 'MapComp',
})
const props = defineProps({
  bloodInfo: {
    type: Object,
    default: () => {
      return {}
    },
  },
})
const mapCtx = ref(null)
const latitude = ref(null)
const longitude = ref(null)
const markers = ref([])
const selectBoxIdx = ref(0)
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
    fail: (err) => {
      console.error('无法获取地理位置:', err)
    },
  })
}
const bloodPackages = computed(() => {
  return props.bloodInfo.bloodPackages || []
})
// 选择箱子
const selectBox = (idx) => {
  console.log(idx)
  selectBoxIdx.value = idx
}
onMounted(() => {
  mapCtx.value = wx.createMapContext('myMap')
  console.log(mapCtx.value, 'mapCtx.value-------')
  getLocation()
})
</script>

<style scoped lang="scss">
.map {
  width: 100%;
  height: 100%;
  position: relative;
  &_list {
    z-index: 1;
    position: absolute;
    top: 8px;
    left: 16px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 12px;
    &_item {
      display: flex;
      align-items: center;
      background: #ffffff;
      padding: 7px 11px;
      border-radius: 15px 15px 15px 15px;
      &-act {
        background: #1890ff;
      }
      &_img {
        width: 13px;
        height: 13px;
        margin-right: 4px;
      }
      &_text {
        font-weight: bold;
        font-size: 10px;
        color: #323233;
        &-act {
          color: #ffffff;
        }
      }
    }
  }
}
</style>
