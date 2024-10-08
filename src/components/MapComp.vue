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
      :scale="scaleVal"
      :markers="markers"
      :polyline="polyline"
      style="width: 100%; height: 142px"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import mapBoxIconSel from '@img/mapBoxIconSel.png'
import mapBoxIcon from '@img/mapBoxIcon.png'
import { $apiGetDrivingPath } from '@/service/index/map'
import { getCenterLonLat, getZoomLevel } from '@/utils/map'
import staIcon from '@img/stationIcon.png'
import hosIcon from '@img/hospitalIcon.png'
import { transStatusMap } from '@/constant'

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
// 中心坐标
const latitude = ref(null)
const longitude = ref(null)
const scaleVal = ref(16)
const markers = ref([]) // 标记点
const polyline = ref([]) // 路线
const selectBoxIdx = ref(0)
const bloodInfoRef = ref<any>({})

watch(
  () => props.bloodInfo,
  (newVal) => {
    bloodInfoRef.value = newVal
    console.log(newVal, 'newVal00000000000')
    handleMap()
  },
)
const getLocation = (from, to) => {
  $apiGetDrivingPath({
    from: from.join(','),
    to: to.join(','),
  }).then((res: any) => {
    const { result } = res
    // 计算中心点
    const centerPoint = getCenterLonLat(from, to)
    // 计算缩放级别
    const zoom = getZoomLevel([from, to])
    latitude.value = centerPoint[0]
    longitude.value = centerPoint[1]
    scaleVal.value = zoom
    // 增加标记点
    const marker1 = {
      id: 1,
      iconPath: staIcon,
      width: 24,
      height: 24,
      latitude: from[0],
      longitude: from[1],
      callout: {
        content: transStatusMap[props.bloodInfo.transportStatus]?.text,
        color: transStatusMap[props.bloodInfo.transportStatus]?.color,
        fontSize: 12,
        borderRadius: 5,
        padding: 5,
        display: 'ALWAYS',
      },
      label: {
        content: bloodInfoRef.value.outboundApplicant,
        color: '#323233',
        fontSize: 12,
        textAlign: 'left',
        display: 'ALWAYS',
        anchorX: -50,
      },
    }
    const marker2 = {
      id: 2,
      iconPath: hosIcon,
      width: 24,
      height: 24,
      latitude: to[0],
      longitude: to[1],
      callout: {
        content: '',
        color: '#000',
        fontSize: 12,
        borderRadius: 5,
        // padding: 5,
        display: 'ALWAYS',
      },
      label: {
        content: bloodInfoRef.value.outboundReceiver,
        color: '#323233',
        fontSize: 12,
        textAlign: 'left',
        display: 'ALWAYS',
        anchorX: -50,
      },
    }
    markers.value = [marker1, marker2]
    // 增加路线
    const route = result.routes[0]
    const coors = route.polyline,
      pl = []
    const kr = 1000000
    for (let i = 2; i < coors.length; i++) {
      coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr
    }
    //将解压后的坐标放入点串数组pl中
    for (let i = 0; i < coors.length; i += 2) {
      pl.push({ latitude: coors[i], longitude: coors[i + 1] })
    }
    polyline.value = [
      {
        points: pl,
        color: '#0084FF',
        width: 4,
        arrowLine: true,
      },
    ]
  })
}
const bloodPackages = computed(() => {
  return props.bloodInfo.eventNoPackageArr || []
})
// 选择箱子
const selectBox = (idx) => {
  selectBoxIdx.value = idx
  handleMap()
}

const handleMap = () => {
  const { consigneeLon, consigneeLat, deliverLon, deliverLat } = bloodInfoRef.value
  if (consigneeLon && consigneeLat && deliverLon && deliverLat) {
    const startLocal = [deliverLat, deliverLon]
    const endLocal = [consigneeLat, consigneeLon]
    getLocation(startLocal, endLocal)
  }
}
onMounted(() => {
  mapCtx.value = wx.createMapContext('myMap')
  handleMap()
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
