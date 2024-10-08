<template>
  <div class="StatisticDetail">
    <div class="StatisticDetail_header">
      <div class="StatisticDetail_header_left">
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
      <div class="StatisticDetail_header_right">
        {{ tab === 'collect' ? '揽收总数：' : '签收总数：' }}{{ statisticObj.amount }}
      </div>
    </div>
    <ul class="StatisticDetail_table">
      <li class="StatisticDetail_table_item">
        <div class="StatisticDetail_table_item_tr">月份</div>
        <div class="StatisticDetail_table_item_tr">无人机配送（单）</div>
        <div class="StatisticDetail_table_item_tr">医院取血（单）</div>
      </li>
      <li class="StatisticDetail_table_item" v-for="(item, index) in 12" :key="index">
        <div class="StatisticDetail_table_item_tr">{{ item }}月</div>
        <div class="StatisticDetail_table_item_tr">
          <span :style="{ color: '#1890FF' }">{{ tableData[index]?.uav || '--' }}</span>
          <span :style="{ color: '#4BBBA1' }">({{ tableData[index]?.uavPer || '--' }}%)</span>
        </div>
        <div class="StatisticDetail_table_item_tr">
          <span :style="{ color: '#1890FF' }">{{ tableData[index]?.hos || '--' }}</span>
          <span :style="{ color: '#FAAB0C' }">({{ tableData[index]?.hosPer || '--' }}%)</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
defineOptions({
  name: 'StatisticDetail',
})

const props = defineProps({
  statisticDetail: {
    type: Object,
    default: () => {
      return {}
    },
  },
})
const tab = ref('collect') // collect揽收 sign签收
const statisticObj = ref(props.statisticDetail.dataMap[tab.value] || {})
const tableData = computed(() => {
  return statisticObj.value.data || []
})
const changeTab = (type: string) => {
  tab.value = type
  statisticObj.value = props.statisticDetail.dataMap[tab.value] || {}
}
</script>

<style scoped lang="scss">
.StatisticDetail {
  width: 100%;

  &_header {
    margin-top: 16px;
    margin-bottom: 14px;
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
  &_table {
    width: 100%;
    &_item {
      padding: 6px 0;
      display: grid;
      grid-template-columns: 0.5fr 1fr 1fr;
      background: #ffffff;
      &_tr {
        text-align: center;
        span {
          color: #323233;
          font-weight: 400;
          font-size: 12px;
        }
      }
    }
    &_item:nth-of-type(odd) {
      background: #eef7ff;
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
</style>
