<route lang="json5">
{
  style: {
    navigationBarTitleText: '历史统计',
  },
  needLogin: true,
}
</route>
<template>
  <page-meta :page-style="'overflow:' + (pageScroll && isMp ? 'hidden' : 'visible')"></page-meta>
  <div class="HistoryStatistic">
    <div class="loadingPage" v-if="isLoading">
      <wd-loading :size="30" />
    </div>
    <wd-status-tip v-if="!isLoading && !statisticData.length" image="search" tip="暂无数据" />
    <view class="content" v-else>
      <div class="content_item" v-for="(item, index) in statisticData" :key="index">
        <wd-collapse v-model="collapseOpen">
          <wd-collapse-item :name="item.title">
            <!-- ="{ expanded }" -->
            <template #title>
              <div class="content_item_header">
                <div class="content_item_header_left">
                  {{ item.title }}
                </div>
                <div class="content_item_header_right">已发血{{ item?.breedValue || 0 }}</div>
              </div>
            </template>
            <StatisticCharts
              v-if="collapseOpen.includes(item.title)"
              :statisticData="item"
              :hosList="hosList"
            />
          </wd-collapse-item>
        </wd-collapse>
      </div>
    </view>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { globalSettingStore } from '@/store/global'
import { storeToRefs } from 'pinia'
import { isMp } from '@/utils/platform'
import StatisticCharts from './components/StatisticCharts.vue'
const hosList = ['深圳中西结合医院', '深圳宝安人民医院', '中山大学附属第七医院']
defineOptions({
  name: 'HistoryStatistic',
})
const store = globalSettingStore() // 全局设置
const { pageScroll } = storeToRefs(store)

const statisticData = ref([]) // 历史统计数据
const isLoading = ref(false) // 是否正在加载
const collapseOpen = ref<string[]>([]) // 张开的卡片数组

onMounted(() => {
  import('./data.json').then((res: any) => {
    statisticData.value = res.default.data
  })
})
</script>

<style scoped lang="scss">
page {
  background: #f7f8fa;
}
.HistoryStatistic {
  width: 100%;
  padding: 9px 16px;
}
.content {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 16px;
  &_item {
    background: #ffffff;
    box-shadow: 0px 2px 12px 1px rgba(100, 101, 102, 0.12);
    border-radius: 4px 4px 4px 4px;
    &_header {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      &_left {
        font-weight: bold;
        font-size: 16px;
        color: #323233;
      }
      &_right {
        font-weight: 400;
        font-size: 12px;
        color: #959799;
      }
    }
  }
}
.loadingPage {
  width: 100%;
  height: 50vh;
  @include CenterHorVertical();
}
:deep(.wd-collapse-item__body) {
  padding: 0 16px 16px !important;
}
</style>
