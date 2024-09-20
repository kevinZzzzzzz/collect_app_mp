<template>
  <div class="BoxTemp">
    <div class="BoxTemp_header">
      <p class="BoxTemp_header_title">温度曲线</p>
      <h6 class="BoxTemp_header_cancel" @click="closeTemp()">取消</h6>
    </div>
    <div class="BoxTemp_main">
      <div class="charts-box">
        <qiun-data-charts type="line" :opts="opts" :chartData="chartData" />
      </div>
    </div>

    <div class="BoxTemp_header">
      <p class="BoxTemp_header_title">预警温度</p>
    </div>
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
onMounted(() => {
  console.log(props.tempBoxList)
  getServerData()
})
</script>

<style scoped lang="scss">
.BoxTemp {
  padding: 0 16px 16px;
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
    // max-height: 400px;
  }
}
.charts-box {
  width: 100%;
  height: 150px;
}
</style>
