<route lang="json5">
{
  style: {
    navigationBarTitleText: '历史记录',
  },
  needLogin: true,
}
</route>
<template>
  <div class="HistoryList">
    <div class="HistoryList_top">
      <BloodPageSearch style="width: 100%" @searchKeyword="searchKeyword($event)" />
      <DateSelect style="width: 100%" @searchByTime="searchByTime($event)" />
    </div>
    <wd-tabs v-model="tab" inactiveColor="#CDCDCD" @click="handleChangTab">
      <block v-for="(item, index) in tabs" :key="index">
        <wd-tab :title="`${item}`" :name="item">
          <!-- <div class="loadingPage" v-if="isLoading">
            <wd-loading :size="30" />
          </div> -->
          <!-- <wd-status-tip
            v-if="!isLoading && searchData && !searchData.length"
            image="search"
            tip="暂无数据"
          /> -->
          <view class="content">
            <div class="main"></div>
          </view>
        </wd-tab>
      </block>
    </wd-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { dayjs } from 'wot-design-uni'
import BloodPageSearch from '@/components/BloodPageSearch.vue'
import DateSelect from '@/components/DateSelect.vue'

const dataFormat1 = 'YYYY-MM-DD'
defineOptions({
  name: 'HistoryList',
})
const historyData = ref([])
const tabs = ['无人机配送', '医院取血']
const tab = ref('无人机配送')

const isLoading = ref(false) // 加载中
const keyword = ref('') // 搜索关键字
const startTime = ref(dayjs(new Date().getTime()).format(dataFormat1)) // 开始时间
const endTime = ref(dayjs(new Date().getTime()).format(dataFormat1)) // 结束时间

/**
 * 关键字查询
 * @param {*} data
 */
const searchKeyword = (data) => {
  historyData.value = []
  keyword.value = data
  // getData()
}
/**
 * 时间查询
 * @param {*} data
 */
const searchByTime = (data) => {
  historyData.value = []
  startTime.value = data.startTime
  endTime.value = data.endTime
  // getData()
}
/**
 * 切换tab
 * @param {*} name tab名称
 */
const handleChangTab = ({ name }) => {
  tab.value = name
}
</script>

<style scoped lang="scss">
.HistoryList {
  width: 100%;
  overflow-y: scroll;
  position: relative;
  &_top {
    width: 100%;
    padding: 0 16px;
    background-color: #fff;
  }
}
</style>
