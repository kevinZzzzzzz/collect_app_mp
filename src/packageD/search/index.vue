<route lang="json5">
{
  style: {
    navigationBarTitleText: '血液交接查询',
  },
  needLogin: true,
}
</route>
<template>
  <!-- <page-meta :page-style="'overflow:' + (pageScroll && isMp ? 'hidden' : 'visible')"></page-meta> -->
  <div class="search">
    <div class="search_top">
      <BloodPageSearch
        style="width: 100%"
        rightBtnType="history"
        @searchKeyword="searchKeyword($event)"
      />
    </div>
    <div class="search_block1">
      <div class="search_block1_header">
        <p class="search_block1_header_left">今日交接</p>
        <image
          @click="gotoHistory"
          class="search_block1_header_right"
          src="@img/tadayHandoverIcon.png"
          mode="scaleToFill"
        />
      </div>
      <div class="search_block1_main">
        <div class="search_block1_main_item">
          <image class="search_block1_main_item_img" :src="sendBloodBg" mode="scaleToFill" />
          <div class="search_block1_main_item_info">
            <p class="search_block1_main_item_info_title">已发血</p>
            <p class="search_block1_main_item_info_num">
              {{ bleedNum }}
              <sub>单</sub>
            </p>
          </div>
        </div>
        <div class="search_block1_main_item">
          <image class="search_block1_main_item_img" :src="collectIconBg" mode="scaleToFill" />
          <div class="search_block1_main_item_info">
            <p class="search_block1_main_item_info_title">已揽收</p>
            <div class="search_block1_main_item_info_line">
              <image
                class="search_block1_main_item_info_line_img"
                src="@img/uavIcon2.png"
                mode="scaleToFill"
              />
              <p class="search_block1_main_item_info_line_text">
                {{ collectData.uavPer }}
              </p>
            </div>
            <div class="search_block1_main_item_info_line">
              <image
                class="search_block1_main_item_info_line_img"
                src="@img/carIcon2.png"
                mode="scaleToFill"
              />
              <p class="search_block1_main_item_info_line_text">
                {{ collectData.hosPer }}
              </p>
            </div>
            <div class="search_block1_main_item_info_line">
              <p class="search_block1_main_item_info_line_text2">
                揽收异常: {{ collectData.error }} 单
              </p>
            </div>
          </div>
          <div
            class="search_block1_main_item_process"
            :style="{
              background: '#667ED5',
              backgroundImage: `conic-gradient(#FFFFFF 0, #FFFFFF ${collectPer}, #667ED5 ${collectPer}, #667ED5 100%)`,
            }"
          >
            <div class="search_block1_main_item_process_inner" :style="{ background: '#7B95F6' }">
              <p class="search_block1_main_item_process_inner_num">
                {{ collectData.amount }}
                <sub>单</sub>
              </p>
            </div>
          </div>
        </div>
        <div class="search_block1_main_item">
          <image class="search_block1_main_item_img" :src="signIconBg" mode="scaleToFill" />
          <div class="search_block1_main_item_info">
            <p class="search_block1_main_item_info_title">已签收</p>
            <div class="search_block1_main_item_info_line">
              <image
                class="search_block1_main_item_info_line_img"
                src="@img/uavIcon2.png"
                mode="scaleToFill"
              />
              <p class="search_block1_main_item_info_line_text">
                {{ signData.uavPer }}
              </p>
            </div>
            <div class="search_block1_main_item_info_line">
              <image
                class="search_block1_main_item_info_line_img"
                src="@img/carIcon2.png"
                mode="scaleToFill"
              />
              <p class="search_block1_main_item_info_line_text">
                {{ signData.hosPer }}
              </p>
            </div>
          </div>
          <div
            class="search_block1_main_item_process"
            :style="{
              background: '#0774D9',
              backgroundImage: `conic-gradient(#FFFFFF 0, #FFFFFF ${signPer}, #0774D9 ${signPer}, #0774D9 100%)`,
            }"
          >
            <div class="search_block1_main_item_process_inner" :style="{ background: '#349DFF' }">
              <p class="search_block1_main_item_process_inner_num">
                {{ signData.amount }}
                <sub>单</sub>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <wd-tabs v-model="tab" inactiveColor="#CDCDCD" @click="handleChangTab">
      <block v-for="(item, index) in tabs" :key="index">
        <wd-tab :title="`${item}`" :name="item">
          <view class="content">
            <div class="main">
              <div class="main_filter">
                <div
                  :class="[
                    'main_filter_item',
                    filterTab === item.value && 'main_filter_item-active',
                  ]"
                  v-for="(item, idx) in filterTabMap[tab]"
                  :key="idx"
                  @click="handleSelectTab(item.value)"
                >
                  <p
                    :class="[
                      'main_filter_item_text',
                      filterTab === item.value && 'main_filter_item_text-active',
                    ]"
                  >
                    {{ item.label }}
                  </p>
                </div>
              </div>
              <div class="loadingPage" v-if="isLoading">
                <wd-loading :size="30" />
              </div>
              <wd-status-tip
                v-if="!isLoading && searchData && !searchData.length"
                image="search"
                tip="暂无数据"
              />
              <div class="main_content">
                <div class="main_content_item" v-for="(item, idx) in searchData" :key="idx">
                  <wd-collapse v-model="collapseOpen">
                    <wd-collapse-item :name="item.hosName">
                      <!-- ="{ expanded }" -->
                      <template #title>
                        <div class="main_content_item_header">
                          <div class="main_content_item_header_left">
                            发往
                            <p class="main_content_item_header_left_name">{{ item.hosName }}</p>
                          </div>
                          <div class="main_content_item_header_right">
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
                      <div class="main_content_item_order" v-for="(i, d) in item.data" :key="d">
                        <OrderItem
                          ref="OrderItemRef"
                          :orderItem="i"
                          :transportStatus="transStatusValueMap[tab]"
                        ></OrderItem>
                      </div>
                    </wd-collapse-item>
                  </wd-collapse>
                </div>
              </div>
            </div>
          </view>
        </wd-tab>
      </block>
    </wd-tabs>
  </div>
</template>

<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { computed, onMounted, ref } from 'vue'
import BloodPageSearch from '@/components/BloodPageSearch.vue'
import { transStatusValueMap } from '@/constant'
import { $apiGetCollectList } from '@/service/index/collect'
import OrderItem from '../components/OrderItem.vue'

const imagesUrl = import.meta.env.VITE_SERVER_IMAGEURI

const sendBloodBg = `${imagesUrl}sendBloodBg.png`
const signIconBg = `${imagesUrl}signIconBg.png`
const collectIconBg = `${imagesUrl}collectIconBg.png`

defineOptions({
  name: 'BloodHandover',
})
const filterTabMap = {
  无人机配送: [
    {
      value: '',
      label: '全部',
    },
    {
      value: '9',
      label: '揽收异常',
    },
    {
      value: '2',
      label: '待揽收',
    },
    {
      value: '4',
      label: '待签收',
    },
  ],
  医院取血: [
    {
      value: '',
      label: '全部',
    },
    {
      value: '2',
      label: '待揽收',
    },
  ],
}
const searchData = ref<any>([])
const collapseOpen = ref<string[]>([])
const tabs = ['无人机配送', '医院取血']
const tab = ref('无人机配送')
const filterTab = ref('') // 筛选条件

const isLoading = ref(false) // 加载中
const keyword = ref('') // 搜索关键字

const bleedNum = ref(124) // 发血单
const collectData = ref({
  uavPer: '25%',
  hosPer: '75%',
  amount: 100, // 已揽收
  error: 20, // 异常单
})
const signData = ref({
  uavPer: '25%',
  hosPer: '75%',
  amount: 68, // 已签收
})
// 已揽收占比
const collectPer = computed(() => {
  return bleedNum.value && collectData.value.amount
    ? (collectData.value.amount / bleedNum.value) * 100 + '%'
    : '0%'
})
// 已签收占比
const signPer = computed(() => {
  return signData.value.amount && collectData.value.amount
    ? (signData.value.amount / collectData.value.amount) * 100 + '%'
    : '0%'
})
/**
 * 切换tab
 * @param {*} name tab名称
 */
const handleChangTab = ({ name }) => {
  filterTab.value = ''
  tab.value = name
}
/**
 * 选择tab过滤条件
 */
const handleSelectTab = (value) => {
  filterTab.value = value
  // getData()
}
/**
 * 关键字查询
 * @param {*} data
 */
const searchKeyword = (data) => {
  searchData.value = []
  keyword.value = data
  // getData()
}
/**
 * 跳转历史记录
 */
const gotoHistory = () => {
  uni.navigateTo({ url: '/packageD/historyList/index' })
}
/**
 * 获取数据
 */
const getData = () => {
  searchData.value = []
  isLoading.value = true
  $apiGetCollectList({
    outboundStatus: transStatusValueMap[tab.value],
    keyword: keyword.value || '',
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
        searchData.value = arrTemp
        console.log(searchData.value)
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
page {
  background: #f7f8fa;
}
.search {
  width: 100%;
  overflow-y: scroll;
  position: relative;
  &_top {
    width: 100%;
    padding: 0 16px;
    background-color: #fff;
  }
  &_block1 {
    width: 100%;
    margin-top: 4px;
    background-color: #fff;
    padding: 7px 16px 13px;
    &_header {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      &_left {
        font-weight: bold;
        font-size: 17px;
        color: #323233;
        margin-left: 9px;
        position: relative;
      }
      &_left::before {
        content: '';
        width: 3px;
        height: 14px;
        background: #1890ff;
        border-radius: 5px 5px 5px 5px;
        position: absolute;
        left: -9px;
        top: 50%;
        transform: translateY(-50%);
      }
      &_right {
        width: 20px;
        height: 23px;
      }
    }
    &_main {
      margin-top: 10px;
      width: 100%;
      display: grid;
      grid-template-columns: 0.7fr 1fr 1fr;
      grid-gap: 9px;
      &_item {
        height: 78px;
        width: 100%;
        border-radius: 4px 4px 4px 4px;
        position: relative;
        &_img {
          height: 78px;
          width: 100%;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 0;
        }
        &_info {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
          padding: 4px 8px;
          &_title {
            font-weight: 400;
            font-size: 12px;
            color: #ffffff;
          }
          &_num {
            margin: 7px 0 0 8px;
            font-weight: bold;
            font-size: 18px;
            color: #ffffff;
            display: flex;
            align-items: baseline;
            sub {
              font-weight: 400;
              font-size: 12px;
              color: #ffffff;
              margin-left: 4px;
            }
          }
          &_line {
            width: 100%;
            padding-left: 9px;
            margin-top: 1px;
            display: flex;
            align-items: center;
            &_img {
              width: 10px;
              height: 10px;
              margin-right: 3px;
            }
            &_text {
              font-weight: 400;
              font-size: 10px;
              color: #ffffff;
              text-align: center;
            }
            &_text2 {
              text-align: center;
              font-weight: 400;
              font-size: 10px;
              color: #ffb5bd;
              padding-left: 8px;
              position: relative;
            }
            &_text2::before {
              content: '';
              width: 5px;
              height: 5px;
              background: #ffb5bd;
              border-radius: 50%;
              position: absolute;
              left: 0;
              top: 50%;
              transform: translateY(-50%);
            }
          }
          &_line:nth-of-type(1) {
            margin-top: 8px;
          }
        }
        &_process {
          width: 53px;
          height: 53px;
          border-radius: 50%;
          background-color: #f0f2f5;
          position: relative;
          left: 64px;
          top: 5px;
          transform: scaleX(-1) rotate(-90deg);
          &_inner {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            justify-content: center;
            align-items: center;
            &_num {
              font-weight: bold;
              font-size: 14px;
              color: #ffffff;
              display: flex;
              align-items: baseline;
              transform: scaleX(-1) rotate(-90deg);
              sub {
                font-weight: 400;
                font-size: 8px;
                color: #ffffff;
              }
            }
          }
        }
      }
    }
  }
}
.main {
  width: 100%;
  &_filter {
    padding: 12px 16px;
    display: flex;
    align-items: center;
    &_item {
      padding: 5px 6px;
      background: #ffffff;
      box-shadow: 0px 2px 12px 1px rgba(100, 101, 102, 0.08);
      border-radius: 4px 4px 4px 4px;
      margin: 0 3px;
      &_text {
        font-weight: 400;
        font-size: 14px;
        color: #848485;
        &-active {
          color: #ffffff;
        }
      }
      &-active {
        background: #1890ff;
      }
    }
  }
  &_content {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 16px;
    padding: 0 16px;
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
}
.content {
  background: #f7f8fa;
}
.loadingPage {
  width: 100%;
  height: 50vh;
  @include CenterHorVertical();
}
</style>
