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
          <div class="loadingPage" v-if="isLoading">
            <wd-loading :size="30" />
          </div>
          <wd-status-tip
            v-if="!isLoading && historyData && !historyData.length"
            image="search"
            tip="暂无数据"
          />
          <view class="content">
            <div class="content_item" v-for="(item, idx) in historyData" :key="idx">
              <wd-collapse v-model="collapseOpen">
                <wd-collapse-item :name="item.hosName">
                  <!-- ="{ expanded }" -->
                  <template #title>
                    <div class="content_item_header">
                      <div class="content_item_header_left">
                        发往
                        <p class="content_item_header_left_name">{{ item.hosName }}</p>
                      </div>
                      <div class="content_item_header_right">
                        {{ (item?.data && item?.data?.length) || 0 }}条
                        <wd-icon
                          :name="
                            collapseOpen.includes(item.hosName)
                              ? 'caret-down-small'
                              : 'caret-right-small'
                          "
                          size="16px"
                        ></wd-icon>
                      </div>
                    </div>
                  </template>
                  <div class="content_item_order" v-for="(i, d) in item.data" :key="d">
                    <OrderItem
                      ref="OrderItemRef"
                      :orderItem="i"
                      :transportStatus="transStatusValueMap[tab]"
                    ></OrderItem>
                  </div>
                </wd-collapse-item>
              </wd-collapse>
            </div>
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
import { transStatusValueMap } from '@/constant'
import { $apiGetCollectList } from '@/service/index/collect'
import OrderItem from '../components/OrderItem.vue'

const dataFormat1 = 'YYYY-MM-DD'
defineOptions({
  name: 'HistoryList',
})
const historyData = ref([])
const collapseOpen = ref<string[]>([])
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
/**
 * 获取数据
 */
const getData = () => {
  historyData.value = []
  isLoading.value = true
  $apiGetCollectList({
    outboundStatus: transStatusValueMap[tab.value],
    keyword: keyword.value || '',
    outboundApplyDateStart: startTime.value || '',
    outboundApplyDateEnd: endTime.value || '',
  })
    .then((res: any) => {
      const { data } = res
      if (data) {
        const arrTemp: Array<{
          hosName?: string
          data?: any
        }> = []
        Object.keys(data).forEach((d) => {
          const obj = {
            hosName: d,
            data: data[d].filter((item) => item.bloodPackages?.length > 0),
          }
          obj.data.length && arrTemp.push(obj)
        })
        historyData.value = arrTemp
      }
    })
    .finally(() => {
      isLoading.value = false
    })
}
onShow(() => {
  getData()
})
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
.loadingPage {
  width: 100%;
  height: 50vh;
  @include CenterHorVertical();
}
.content {
  background: #f7f8fa;
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 16px;
  padding: 16px;
  &_item {
    position: relative;
    width: 100%;
    &_header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      // width: 100%;
      &_left {
        display: flex;
        width: auto;
        font-family: PingFang SC;
        font-size: 14px;
        font-weight: bold;
        color: #323233;
        &_name {
          margin-left: 12px;
          color: #055197;
        }
      }
      &_right {
        position: absolute;
        right: 16px;
        font-size: 12px;
        font-weight: 400;
        line-height: 18px;
        color: #959799;
      }
    }
    &_order {
      width: 100%;
      margin-bottom: 16px;
    }
  }
}
</style>
