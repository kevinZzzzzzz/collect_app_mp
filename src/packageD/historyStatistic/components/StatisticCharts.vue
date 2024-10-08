<template>
  <div class="StatisticCharts">
    <div class="StatisticCharts_select" @click="showHosSelect()">
      {{ selectHos || '全部医院/机构' }}
    </div>
    <div class="StatisticCharts_header">
      <div class="StatisticCharts_header_left">
        {{ tab === 'collect' ? '揽收总数：' : '签收总数：' }}{{ statisticObj.amount }}
      </div>
      <div class="StatisticCharts_header_right">
        <div class="radioRef">
          <div
            :class="['radioRef_item', tab === 'collect' ? 'radioRef_item-active' : '']"
            @click="changeTab('collect')"
          >
            揽收
          </div>
          <div
            :class="['radioRef_item', tab === 'sign' ? 'radioRef_item-active' : '']"
            @click="changeTab('sign')"
          >
            签收
          </div>
        </div>
      </div>
    </div>
    <div class="charts-box">
      <qiun-data-charts
        v-if="chartData"
        style="transform: scaleX(0.89)"
        type="mix"
        :opts="opts"
        :chartData="chartData"
      />
    </div>
    <div class="StatisticCharts_btm">
      <div class="StatisticCharts_btm_btn" @click="showDetail">详情</div>
    </div>
  </div>

  <!-- 选择医院 -->
  <wd-popup v-model="showHosSelectPopup" position="bottom" @close="closeHosSelPopup">
    <div class="hosSelectPopup">
      <div class="hosSelectPopup_header">
        <div class="hosSelectPopup_header_left" @click="closeHosSelPopup">取消</div>
        <div class="hosSelectPopup_header_center">选择医院</div>
        <div class="hosSelectPopup_header_right" @click="makeSure">确认</div>
      </div>
      <wd-picker-view :columns="props.hosList" v-model="hosSelectPopup" />
    </div>
  </wd-popup>

  <!-- 详情 -->
  <wd-popup v-model="showDetailPopup" position="bottom" @close="closeDetailPopup">
    <div class="detailPopup">
      <div class="detailPopup_header">
        <div class="detailPopup_header_text">详情</div>
        <div class="detailPopup_header_cancel" @click="closeDetailPopup">取消</div>
      </div>
      <div class="detailPopup_info">
        <div class="detailPopup_info_left">
          <p class="detailPopup_info_left_title">
            {{ statisticData.title }}
          </p>
          <h4 class="detailPopup_info_left_breed">已发血{{ statisticData.breedValue }}</h4>
        </div>
        <div class="detailPopup_info_right">
          {{ selectHos || '全部医院/机构' }}
        </div>
      </div>
      <StatisticDetail :statisticDetail="statisticData" />
    </div>
  </wd-popup>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import StatisticDetail from './StatisticDetail.vue'

defineOptions({
  name: 'StatisticCharts',
})

const props = defineProps({
  statisticData: {
    type: Object,
    default: () => {
      return {}
    },
  },
  hosList: {
    type: Array,
    default: () => {
      return []
    },
  },
})
const categories = [
  '1月',
  '2月',
  '3月',
  '4月',
  '5月',
  '6月',
  '7月',
  '8月',
  '9月',
  '10月',
  '11月',
  '12月',
]
const selectHos = ref('') // 选择的医院
const hosSelectPopup = ref(null) // 选择医院弹窗
const tab = ref('collect') // collect揽收 sign签收

const chartData = ref<any>(null)
const statisticObj = ref<any>({})

const showHosSelectPopup = ref(false) // 是否显示医院选择弹窗
const showDetailPopup = ref(false) // 是否显示详情弹窗

const opts = ref({
  color: ['#1890FF', '#3FDAF8', '#4BBBA1', '#FAAB0C'],
  padding: [20, 5, 0, 0],
  enableScroll: false,
  legend: {
    position: 'bottom',
    fontColor: '#848485',
  },
  dataLabel: false,
  // dataPointShape: false,
  xAxis: {
    disableGrid: true,
    axisLine: false,
    fontColor: '#848485',
    labelCount: 6,
    itemCount: 6,
  },
  yAxis: {
    disabled: false,
    disableGrid: false,
    splitNumber: 5,
    gridType: 'dash',
    dashLength: 4,
    gridColor: '#CCCCCC',
    padding: 10,
    showTitle: true,
    data: [
      {
        position: 'left',
        min: 0,
        title: tab.value === 'collect' ? '揽收数/单' : '签收数/单',
      },
      {
        position: 'right',
        min: 0,
        title: tab.value === 'collect' ? '揽收率/%' : '签收率/%',
      },
    ],
  },
  extra: {
    column: {
      type: 'group',
      width: 4,
      seriesGap: 0,
      categoryGap: 0,
      activeBgColor: '#000000',
      activeBgOpacity: 0.08,
    },
    line: {
      type: 'hollow',
      width: 2,
      activeType: 'none',
    },
  },
})
/**
 * 选择医院弹窗
 */
const showHosSelect = () => {
  hosSelectPopup.value = selectHos.value || props.hosList[0]
  showHosSelectPopup.value = true
}
/**
 * 关闭医院选择弹窗
 */
const closeHosSelPopup = () => {
  showHosSelectPopup.value = false
}
/**
 * 确定选择医院
 */
const makeSure = () => {
  selectHos.value = hosSelectPopup.value
  closeHosSelPopup()
}
/**
 * 切换tab
 * @param type tab类型
 */
const changeTab = (type: string) => {
  tab.value = type
  statisticObj.value = props.statisticData.dataMap[type] || {}
  initChart()
}
/**
 * 关闭详情弹窗
 */
const closeDetailPopup = () => {
  showDetailPopup.value = false
}
/**
 * 显示详情弹窗
 */
const showDetail = () => {
  showDetailPopup.value = true
}
/**
 * 初始化图表
 */
const initChart = () => {
  chartData.value = null
  setTimeout(() => {
    let res = {
      categories: categories,
      series: [
        {
          name: '无人机配送',
          type: 'column',
          data: statisticObj.value.data?.map((d, idx) => {
            return d.uav
          }),
        },
        {
          name: '医院取血',
          type: 'column',
          data: statisticObj.value.data?.map((d, idx) => {
            return d.hos
          }),
        },
        {
          name: '无人机配送率',
          type: 'line',
          index: 1,
          style: 'curve',
          data: statisticObj.value.data?.map((d, idx) => {
            return d.uavPer
          }),
        },
        {
          name: '医院配送率',
          type: 'line',
          index: 1,
          style: 'curve',
          data: statisticObj.value.data?.map((d, idx) => {
            return d.hosPer
          }),
        },
      ],
    }
    chartData.value = JSON.parse(
      JSON.stringify({
        categories: res.categories,
        series: res.series,
      }),
    )
  }, 500)
}
onMounted(() => {
  statisticObj.value = props.statisticData.dataMap[tab.value]
  initChart()
})
</script>

<style scoped lang="scss">
.StatisticCharts {
  width: 100%;
  &_select {
    cursor: pointer;
    width: 145px;
    max-width: 145px;
    display: inline-block;
    border-radius: 3px 3px 3px 3px;
    border: 1px solid #1890ff;
    padding: 3px 0px 3px 8px;
    font-weight: 400;
    font-size: 14px;
    color: #1890ff;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &_header {
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &_left {
      font-weight: 400;
      font-size: 12px;
      color: #1890ff;
    }
    &_right {
      // width: 100%;
    }
  }
  &_btm {
    margin-top: 15px;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    &_btn {
      padding: 4px 16px;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #1890ff;
      font-weight: 400;
      font-size: 12px;
      color: #1890ff;
    }
  }
}
.radioRef {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 4px;
  background: #eef7ff;
  box-shadow: 0px 3px 12px 1px rgba(100, 101, 102, 0.12);
  border-radius: 12px 12px 12px 12px;
  &_item {
    padding: 3px 13px;
    font-weight: 400;
    font-size: 12px;
    color: #323233;
    &-active {
      background: #1890ff;
      box-shadow: inset 3px 3px 3px 1px #1679d4;
      border-radius: 12px 12px 12px 12px;
      font-weight: 400;
      font-size: 12px;
      color: #ffffff;
    }
  }
}
.hosSelectPopup {
  width: 100%;
  &_header {
    padding: 0 16px;
    width: 100%;
    height: 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &_left {
      font-size: 14px;
      color: #969799;
    }
    &_center {
      font-weight: 400;
      font-size: 16px;
      color: #323233;
    }
    &_right {
      font-size: 14px;
      color: #1890ff;
    }
  }
}
.detailPopup {
  width: 100%;
  padding: 16px;
  &_header {
    padding-left: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &_text {
      font-weight: bold;
      font-size: 17px;
      color: #323233;
      position: relative;
    }
    &_text::before {
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
  &_info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;
    &_left {
      display: flex;
      align-items: center;
      &_title {
        font-weight: bold;
        font-size: 14px;
        color: #323233;
        margin-right: 16px;
      }
      &_breed {
        font-weight: 400;
        font-size: 12px;
        color: #1890ff;
      }
    }
    &_right {
      font-weight: 400;
      font-size: 14px;
      color: #323233;
    }
  }
}
.charts-box {
  width: 100%;
  display: flex;
  justify-content: center;
  // overflow-x: scroll;
  height: 200px;
}
</style>
