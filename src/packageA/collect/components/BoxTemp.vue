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
              <p class="BoxTemp_main_boxItem_list_item_col_num">{{ d.capacity }}</p>
              <p class="BoxTemp_main_boxItem_list_item_col_type">{{ d.bloodType }}</p>
            </div>
            <div class="BoxTemp_main_boxItem_list_item_col-2line">
              <p class="BoxTemp_main_boxItem_list_item_col_num">{{ d.temp }}</p>
              <p class="BoxTemp_main_boxItem_list_item_col_type">温度</p>
            </div>
          </div>
        </div>
        <div class="charts-box">
          <qiun-data-charts type="line" :opts="opts" :chartData="chartData" />
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
})
const boxList = ref<any>(props.tempBoxList || [])
const chartData = ref({})
const opts = ref({
  color: ['#1ACDB4', '#FAAB0C'],
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
      activeType: 'hollow',
    },
  },
})
const getServerData = () => {
  //模拟从服务器获取数据时的延时
  setTimeout(() => {
    //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
    let res = {
      categories: ['装箱', '发血', '揽收', '启运', '运送中', '签收'],
      series: [
        {
          name: '成交量A',
          data: [35, 8, 25, 37, 4, 20],
        },
        {
          name: '成交量B',
          data: [70, 40, 65, 100, 44, 68],
        },
      ],
    }
    chartData.value = JSON.parse(JSON.stringify(res))
  }, 500)
}
const closeTemp = () => {
  emit('closeTempBox')
}
const bloodBagGroupList = computed(() => {
  let arr = []
  // 处理温度数据
  const handleTemp = (obj) => {
    let tempL = null
    let tempR = null
    if (obj.deviceStremDataMap?.temp && Array.isArray(obj.deviceStremDataMap?.temp)) {
      tempL = obj.deviceStremDataMap?.temp[0]
      tempR = obj.deviceStremDataMap?.temp[1]
    }
    return tempL && tempR
      ? `${tempL}~${tempR}°C`
      : tempL
        ? `${tempL}°C`
        : tempR
          ? `${tempR}°C`
          : '--'
  }
  if (boxList.value && boxList.value.length) {
    arr = new Array(boxList.value.length)
    boxList.value.forEach((d, idx) => {
      arr[idx] = []
      const tempData = handleTemp(d)
      Object.values(d?.bloodBagGroupMap).forEach((item: Array<any>) => {
        item?.forEach((d) => {
          d.temp = tempData
          arr[idx].push(d)
        })
      })
    })
  }
  return arr
})
onMounted(() => {
  getServerData()
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
