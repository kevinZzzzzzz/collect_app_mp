<template>
  <div class="BoxTemp">
    <div class="BoxTemp_header">
      <p class="BoxTemp_header_title">温度曲线</p>
      <h6 class="BoxTemp_header_cancel" @click="closeTemp()">取消</h6>
    </div>
    <div class="BoxTemp_main" v-if="boxList && boxList.length">
      <div class="BoxTemp_main_boxItem" v-for="(item, index) in boxList" :key="index">
        <div class="BoxTemp_main_boxItem_header">
          <image
            class="BoxTemp_main_boxItem_header_img"
            src="@img/transBoxIcon.png"
            mode="scaleToFill"
          />
          <p class="BoxTemp_main_boxItem_header_code">{{ item.code || '----' }}</p>
        </div>
        <div class="BoxTemp_main_boxItem_list" v-if="bloodBagGroupList[index]">
          <div
            class="BoxTemp_main_boxItem_list_item"
            v-for="(d, idx) in bloodBagGroupList[index]"
            :key="idx"
          >
            <div class="BoxTemp_main_boxItem_list_item_col">
              <div class="BoxTemp_main_boxItem_list_item_col_name">
                <p class="BoxTemp_main_boxItem_list_item_col_name_text">
                  {{ idx + 1 }}
                </p>
              </div>
            </div>
            <div class="BoxTemp_main_boxItem_list_item_col-2line">
              <p class="BoxTemp_main_boxItem_list_item_col_num">{{ d.conversion || '--' }}U</p>
              <p class="BoxTemp_main_boxItem_list_item_col_type">{{ d.bloodType }}</p>
            </div>
            <div class="BoxTemp_main_boxItem_list_item_col-2line">
              <p class="BoxTemp_main_boxItem_list_item_col_num">{{ d.temp }}</p>
              <p class="BoxTemp_main_boxItem_list_item_col_type">温度</p>
            </div>
          </div>
        </div>
        <div
          class="charts-box"
          v-if="showChart && item.chartData?.series && item.chartData?.series.length"
        >
          <qiun-data-charts type="line" :opts="opts" :chartData="item.chartData" />
        </div>
        <div class="charts-box" v-else>
          <wd-status-tip image="search" tip="暂无数据" />
        </div>
      </div>
    </div>
    <!-- <div class="BoxTemp_main">
    </div> -->

    <!-- <div class="BoxTemp_header">
      <p class="BoxTemp_header_title">预警温度</p>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { $apiGetBoxDeviceData } from '@/service/index/collect'
import { ref, onMounted } from 'vue'
defineOptions({
  name: 'BoxTemp',
})
const emit = defineEmits(['closeTempBox'])
const props = defineProps({
  tempBoxList: {
    type: Array<any>,
    default: () => {
      return []
    },
  },
  outboundOrderNo: {
    type: String,
    default: () => {
      return ''
    },
  },
})
const boxList = ref<any>(props.tempBoxList || [])
const bloodBagGroupList = ref<any>([])
const showChart = ref(false)
const opts = ref({
  color: [
    '#1890FF',
    '#91CB74',
    '#FAC858',
    '#EE6666',
    '#73C0DE',
    '#3CA272',
    '#FC8452',
    '#9A60B4',
    '#ea7ccc',
  ],
  padding: [0, 10, 0, 10],
  enableScroll: false,
  legend: {
    position: 'top',
    fontColor: '#848485',
  },
  dataLabel: false,
  // dataPointShape: false,
  xAxis: {
    disableGrid: true,
    axisLine: false,
    fontColor: '#848485',
  },
  yAxis: {
    gridType: 'solid',
    dashLength: 2,
  },
  extra: {
    line: {
      type: 'curve',
      width: 2,
      activeType: 'none',
    },
  },
})
const handleChartData = (dataMap: any, assetCode: string) => {
  let categories = []
  let series = []
  if (dataMap) {
    const assetData: Array<any> = Object.values(dataMap)
    categories = assetData[0]?.map((d) => {
      return (d.remark && d.remark.replace('已', '')) || ''
    })
    series = Object.keys(dataMap)?.map((key, index) => {
      return {
        name: assetCode,
        pointShape: 'none',
        data: dataMap[key]?.map((d, idx) => {
          return d.insideTemp || 0
        }),
      }
    })
    return JSON.parse(
      JSON.stringify({
        categories,
        series,
      }),
    )
  }

  return null
}
const getChartData = () => {
  const boxCodeArr = boxList.value.map((d) => d.code)
  $apiGetBoxDeviceData({
    outboundOrderNo: props.outboundOrderNo,
    boxCodeSet: boxCodeArr,
  }).then((res: any) => {
    const { data } = res
    data.assetBaseDeviceInfoVoList.forEach((item, index) => {
      boxList.value.forEach((d, idx) => {
        if (item.assetCode === d.code) {
          if (item.deviceId2InfoDataMap) {
            d.chartData = handleChartData(item.deviceId2InfoDataMap, item.assetCode)
          } else {
            d.chartData = null
          }
        }
      })
    })
    setTimeout(() => {
      showChart.value = true
    }, 500)
  })
}
const closeTemp = () => {
  boxList.value = []
  emit('closeTempBox')
}
const initData = () => {
  let arr = []
  //   // 处理温度数据
  const handleTemp = (obj) => {
    let temp = ''
    if (obj.deviceStremDataMap?.temp && Array.isArray(obj.deviceStremDataMap?.temp)) {
      obj.deviceStremDataMap?.temp.forEach((item, index) => {
        temp += `${item}℃ `
      })
    }
    return temp || '--'
  }
  if (boxList.value && boxList.value.length) {
    arr = new Array(boxList.value.length)
    boxList.value.forEach((d, idx) => {
      arr[idx] = []
      const tempData = handleTemp(d)
      Object.values(d?.bloodBagGroupMap).forEach((item: Array<any>) => {
        if (item.length > 1) {
          const obj = {
            bloodType: '',
            conversion: null,
          }
          item.forEach((d) => {
            d.bloodType && (obj.bloodType = d.bloodType)
            d.conversion && (obj.conversion += Number(d.conversion))
          })
          arr[idx].push({
            bloodType: obj.bloodType,
            conversion: obj.conversion,
            temp: tempData,
          })
        } else {
          arr[idx].push({
            bloodType: item[0].bloodType,
            conversion: item[0].conversion,
            temp: tempData,
          })
        }
        // item?.forEach((d) => {
        //   d.temp = tempData
        //   arr[idx].push(d)
        // })
      })
    })
  }
  bloodBagGroupList.value = arr
}
onMounted(() => {
  initData()
  getChartData()
})
</script>

<style scoped lang="scss">
.BoxTemp {
  padding: 0 16px 32px;
  &_header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 13px 0 13px 10px;
    &_title {
      font-weight: bold;
      font-size: 17px;
      color: #323233;
      position: relative;
    }
    &_title::before {
      position: absolute;
      top: 5px;
      left: -9px;
      width: 3px;
      height: 14px;
      content: '';
      background: #1890ff;
      border-radius: 5px 5px 5px 5px;
    }
    &_cancel {
      font-weight: 400;
      font-size: 14px;
      color: #1890ff;
    }
  }
  &_main {
    width: 100%;
    max-height: 300px;
    overflow-y: scroll;
    &_boxItem {
      width: 100%;
      &_header {
        display: flex;
        align-items: center;
        &_img {
          width: 27px;
          height: 27px;
          margin-right: 8px;
        }
        &_code {
          font-weight: bold;
          font-size: 14px;
          color: #323233;
        }
      }
      &_list {
        margin-top: 10px;
        display: grid;
        grid-template-columns: 1fr;
        grid-gap: 16px;
        &_item {
          display: grid;
          grid-template-columns: 0.4fr 1fr 1fr;
          &_col {
            display: flex;
            align-items: center;
            &_name {
              // width: 38px;
              // height: 22px;
              padding: 3px 12px;
              background: #eef7ff;
              border-radius: 4px 4px 4px 4px;
              border: 1px solid #1890ff;
              @include CenterHorVertical();
              &_text {
                font-size: 12px;
                color: #1890ff;
              }
            }
            &-2line {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            }
            &_num {
              font-weight: 600;
              font-size: 14px;
              color: #1890ff;
            }
            &_type {
              font-size: 14px;
              color: #323233;
            }
          }
        }
      }
    }
  }
  &_main::-webkit-scrollbar {
    display: none;
  }
}
.charts-box {
  width: 100%;
  height: 150px;
}
</style>
