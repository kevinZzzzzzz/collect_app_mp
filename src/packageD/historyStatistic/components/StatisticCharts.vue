<template>
  <div class="StatisticCharts">
    <div class="StatisticCharts_select" @click="showHosSelect()">
      {{ selectHos || '全部医院/机构' }}
    </div>
    <div class="StatisticCharts_header">
      <div class="StatisticCharts_header_left">
        {{ tab === 'collect' ? '揽收总数：' : '签收总数：' }}{{ chartData.amount }}
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
    <div class="StatisticCharts_charts"></div>
    <div class="StatisticCharts_btm" @click="showDetail">
      <div class="StatisticCharts_btm_btn">详情</div>
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
const selectHos = ref('') // 选择的医院
const hosSelectPopup = ref(null) // 选择医院弹窗
const tab = ref('collect') // collect揽收 sign签收
const chartData = ref(props.statisticData.dataMap[tab.value] || {})
const showHosSelectPopup = ref(false) // 是否显示医院选择弹窗

const showDetailPopup = ref(false) // 是否显示详情弹窗
const showHosSelect = () => {
  hosSelectPopup.value = selectHos.value || props.hosList[0]
  showHosSelectPopup.value = true
}
const closeHosSelPopup = () => {
  showHosSelectPopup.value = false
}
const makeSure = () => {
  selectHos.value = hosSelectPopup.value
  closeHosSelPopup()
}

const changeTab = (type: string) => {
  tab.value = type
  chartData.value = props.statisticData.dataMap[tab.value] || {}
}
const closeDetailPopup = () => {
  showDetailPopup.value = false
}
const showDetail = () => {
  showDetailPopup.value = true
}
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
    margin-top: 16px;
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
    justify-content: end;
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
</style>
