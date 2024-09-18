<template>
  <div class="BoxTemp">
    <div class="BoxTemp_header">
      <p class="BoxTemp_header_title">温度曲线</p>
      <h6 class="BoxTemp_header_cancel" @click="closeTemp()">取消</h6>
    </div>
    <ul>
      <li v-for="item in 20" :key="item">{{ item }}</li>
    </ul>
    <!-- <div class="charts-box">
      <qiunVueUcharts type="line" :opts="opts" :chartData="chartData" />
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
defineOptions({
  name: 'BoxTemp',
})
const emit = defineEmits(['closeTempBox'])
const chartData = ref({})
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
  padding: [15, 10, 0, 15],
  enableScroll: false,
  legend: {},
  xAxis: {
    disableGrid: true,
  },
  yAxis: {
    gridType: 'dash',
    dashLength: 2,
  },
  extra: {
    line: {
      type: 'straight',
      width: 2,
      activeType: 'hollow',
    },
  },
})

const closeTemp = () => {
  emit('closeTempBox')
}
const getServerData = () => {
  // 模拟从服务器获取数据时的延时
  setTimeout(() => {
    // 模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
    const res = {
      categories: ['2018', '2019', '2020', '2021', '2022', '2023'],
      series: [
        {
          name: '成交量A',
          data: [35, 8, 25, 37, 4, 20],
        },
        {
          name: '成交量B',
          data: [70, 40, 65, 100, 44, 68],
        },
        {
          name: '成交量C',
          data: [100, 80, 95, 150, 112, 132],
        },
      ],
    }
    chartData.value = JSON.parse(JSON.stringify(res))
  }, 500)
}
onMounted(() => {
  // getServerData()
})
</script>

<style scoped lang="scss">
.BoxTemp {
  padding: 0 16px 16px;
  max-height: 200px;
  // overflow-y: scroll;
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
}
.charts-box {
  width: 500px;
  height: 300px;
}
</style>
