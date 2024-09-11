<route lang="json5">
{
  style: {
    navigationBarTitleText: '血液揽收',
  },
}
</route>
<template>
  <div class="collect pageCenter">
    <BloodPageSearch style="width: 100%" />
    <DateSelect style="width: 100%" />
    <wd-tabs v-model="tab" inactiveColor="#CDCDCD">
      <block v-for="(item, index) in tabs" :key="index">
        <wd-tab :title="`${item}`">
          <view class="content">
            <div class="collect_item" v-for="(item, idx) in collectData" :key="idx">
              <wd-collapse v-model="collapseOpen">
                <wd-collapse-item :name="item.hosName">
                  <template #title="{ expanded }">
                    <div class="collect_item_header">
                      <div class="collect_item_header_left">
                        发往
                        <p class="collect_item_header_left_name">{{ item.hosName }}</p>
                      </div>
                      <div class="collect_item_header_right">
                        {{ (item?.data && item?.data?.length) || 0 }}条交接单
                        <wd-icon
                          :name="expanded ? 'caret-down-small' : 'caret-right-small'"
                          size="16px"
                        ></wd-icon>
                      </div>
                    </div>
                  </template>
                  <div
                    class="collect_item_order"
                    v-for="(i, d) in item.data"
                    :key="d"
                    @click="goDetail(i)"
                  >
                    <OrderItem :orderItem="i" :tabSel="tab" :tabsList="tabs">
                      <template v-slot:time>
                        <div class="collect_item_order_time">发血时间：2024-08-20 12:00</div>
                      </template>
                    </OrderItem>
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
import { onMounted, ref } from 'vue'
import BloodPageSearch from '@/components/BloodPageSearch.vue'
import DateSelect from '@/components/DateSelect.vue'
import OrderItem from './components/OrderItem.vue'
defineOptions({
  name: 'Collect',
})
const tabs = ref(['待揽收', '已揽收', '异常件'])
const tab = ref(0)

const collectData = ref<
  {
    hosName?: string
    data?: any
  }[]
>([]) // 揽收数据
const collapseOpen = ref<string[]>([])
const getData = () => {
  import('./data.json').then(({ default: res }) => {
    const { data } = res
    if (data) {
      const arrTemp: Array<{
        hosName?: string
        data?: any
      }> = []
      Object.keys(data).forEach((d) => {
        const obj = {
          hosName: d,
          data: data[d],
        }
        arrTemp.push(obj)
      })
      collectData.value = arrTemp
    }
  })
}

/**
 * 跳转详情
 */
const goDetail = (data: any) => {
  uni.navigateTo({
    url: `/packageA/collect/detail?data=${encodeURIComponent(JSON.stringify(data))}`,
  })
}
onMounted(() => {
  getData()
})
</script>

<style scoped lang="scss">
.collect {
  width: 100%;
  padding: 0 16px;
  overflow-y: scroll;
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
      &_time {
        width: 100%;
        margin-top: 3px;
        font-size: 12px;
        font-weight: 400;
        color: #999393;
        text-align: center;
      }
    }
  }
}
.content {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 16px;
  padding: 16px 0;
}
:deep(.wd-collapse-item__body) {
  padding: 14px 16px !important;
}
:deep(.wd-collapse-item) {
  background: #ffffff;
  border-radius: 4px 4px 4px 4px;
  box-shadow: 0px 2px 12px 1px rgba(100, 101, 102, 0.12);
}
</style>
