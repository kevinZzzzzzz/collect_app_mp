<route lang="json5">
{
  style: {
    navigationBarTitleText: '血液揽收',
  },
  needLogin: true,
}
</route>
<template>
  <page-meta :page-style="'overflow:' + (pageScroll && isMp ? 'hidden' : 'visible')"></page-meta>
  <div class="collect pageCenter">
    <BloodPageSearch
      style="width: 100%"
      rightBtnType="person"
      @searchKeyword="searchKeyword($event)"
    />
    <DateSelect style="width: 100%" @searchByTime="searchByTime($event)" />
    <!-- <div class="collect_alert" @click="goNotified">
      <wd-badge :top="10" modelValue="12" bg-color="red">
        <image class="collect_alert_img" src="@img/bellIcon.png" mode="scaleToFill" />
      </wd-badge>
    </div> -->
    <wd-tabs v-model="tab" inactiveColor="#CDCDCD" @click="handleChangTab">
      <block v-for="(item, index) in tabs" :key="index">
        <wd-tab :title="`${item}`" :name="item">
          <div class="loadingPage" v-if="isLoading">
            <wd-loading :size="30" />
          </div>
          <wd-status-tip
            v-if="!isLoading && collectData && !collectData.length"
            image="search"
            tip="暂无数据"
          />
          <view class="content">
            <div class="collect_item" v-for="(item, idx) in collectData" :key="idx">
              <wd-collapse v-model="collapseOpen">
                <wd-collapse-item :name="item.hosName">
                  <!-- ="{ expanded }" -->
                  <template #title>
                    <div class="collect_item_header">
                      <div class="collect_item_header_left">
                        发往
                        <p class="collect_item_header_left_name">{{ item.hosName }}</p>
                      </div>
                      <div class="collect_item_header_right">
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
                  <div class="collect_item_order" v-for="(i, d) in item.data" :key="d">
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
import { onShow } from '@dcloudio/uni-app'
import { onMounted, ref } from 'vue'
import { dayjs } from 'wot-design-uni'
import BloodPageSearch from '@/components/BloodPageSearch.vue'
import DateSelect from '@/components/DateSelect.vue'
import OrderItem from './components/OrderItem.vue'
import { globalSettingStore } from '@/store/global'
import { storeToRefs } from 'pinia'
import { $apiGetCollectList } from '@/service/index/collect'
import { transStatusValueMap } from '@/constant'
import { isMp } from '@/utils/platform'

const dataFormat1 = 'YYYY-MM-DD'
defineOptions({
  name: 'Collect',
})
const store = globalSettingStore() // 全局设置
const { pageScroll } = storeToRefs(store)
const tabs = ['待揽收', '已揽收', '异常']
const tab = ref('待揽收')
const isLoading = ref(false) // 加载中
const keyword = ref('') // 搜索关键字
const startTime = ref(dayjs(new Date().getTime()).format(dataFormat1)) // 开始时间
const endTime = ref(dayjs(new Date().getTime()).format(dataFormat1)) // 结束时间

const collectData = ref<
  {
    hosName?: string
    data?: any
  }[]
>([]) // 揽收数据
const collapseOpen = ref<string[]>([])

/**
 * 获取数据
 */
const getData = () => {
  collectData.value = []
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
        collectData.value = arrTemp
      }
    })
    .finally(() => {
      isLoading.value = false
    })
}
/**
 * 切换tab
 * @param {*} name tab名称
 */
const handleChangTab = ({ name }) => {
  collectData.value = []
  collapseOpen.value = []
  tab.value = name
  getData()
}
/**
 * 关键字查询
 * @param {*} data
 */
const searchKeyword = (data) => {
  collectData.value = []
  keyword.value = data
  getData()
}
/**
 * 时间查询
 * @param {*} data
 */
const searchByTime = (data) => {
  collectData.value = []
  startTime.value = data.startTime
  endTime.value = data.endTime
  getData()
}
/**
 * 跳转消息通知
 */
const goNotified = (data: any) => {
  uni.navigateTo({
    url: `/packageB/notified/index?notifiedType=揽收`,
  })
}
onShow(() => {
  getData()
})
</script>

<style scoped lang="scss">
.collect {
  width: 100%;
  padding: 0 16px;
  overflow-y: scroll;
  position: relative;
  &_alert {
    z-index: 1;
    position: fixed;
    top: 25%;
    right: 6px;
    transform: translateY(-50%);
    width: 80px;
    height: 80px;
    @include CenterHorVertical();
    background: url('@img/bellBgIcon.png') no-repeat;
    background-size: 100% 100%;
    border-radius: 50%;
    &_img {
      width: 40px;
      height: 40px;
    }
  }
  &_item {
    position: relative;
    width: 100%;
    padding: 0 1px;
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
.loadingPage {
  width: 100%;
  height: 50vh;
  @include CenterHorVertical();
}
.content {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 16px;
  padding: 16px 0;
}
:deep(.wd-collapse-item__body) {
  padding: 0px 16px 14px !important;
}
:deep(.wd-collapse-item) {
  background: #ffffff;
  border-radius: 4px 4px 4px 4px;
  box-shadow: 0px 2px 12px 1px rgba(100, 101, 102, 0.12);
}
.orderBtn {
  width: 129px;
  height: 30px;
  // background: #ffffff;
  @include CenterHorVertical();
}
</style>
