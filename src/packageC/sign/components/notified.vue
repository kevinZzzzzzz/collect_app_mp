<template>
  <div class="Notified">
    <wd-tabs v-model="tab" inactiveColor="#CDCDCD">
      <block v-for="(item, index) in tabs" :key="index">
        <wd-tab :title="`${item}`" :name="item">
          <div class="loadingPage" v-if="isLoading">
            <wd-loading :size="30" />
          </div>
          <!-- <wd-status-tip image="search" tip="暂无数据" /> -->
          <view class="content">
            <div class="content_item" v-for="(item, idx) in notifiedList" :key="idx">
              <div class="content_item_header">
                <div class="content_item_header_left">
                  <image
                    class="content_item_header_left_img"
                    :src="notifiedCollectIcon"
                    mode="scaleToFill"
                  />
                  <p class="content_item_header_left_title">{{ item.title }}</p>
                </div>
                <div class="content_item_header_right">
                  {{ item.date }}
                </div>
              </div>
              <div class="content_item_ctx">联系人: {{ item.contact }}</div>
              <div class="content_item_ctx">地址: {{ item.address }}</div>
              <div class="content_item_ctx">
                {{ item.content }}
              </div>
              <div v-if="item.status == 7 && item.reason" class="content_item_ctx">
                异常原因: {{ item.reason }}
              </div>
            </div>
          </view>
        </wd-tab>
      </block>
    </wd-tabs>
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance, onMounted, ref } from 'vue'
import { getNavigateOptions } from '@/utils/index'
import notifiedCollectIcon from '@img/notifiedCollectIcon.png'
import notifiedCollectIcon2 from '@img/notifiedCollectIcon2.png'
import notifiedCollectErrorIcon from '@img/notifiedCollectErrorIcon.png'
defineOptions({
  name: 'Notified',
})
const iconMap = {
  6: notifiedCollectIcon,
  6.5: notifiedCollectIcon2,
  7: notifiedCollectErrorIcon,
}
const tabs = ref(['全部', '待揽收通知', '告警提醒']) // 标签页列表
const tab = ref('全部')
const isLoading = ref(false) // 加载中
const notifiedList = ref([]) // 揽收通知列表
onMounted(() => {
  isLoading.value = true
  import('./notified.json').then((res: any) => {
    const { data } = res
    console.log(data, 'res')
    isLoading.value = false
    notifiedList.value = data
  })
})
onReachBottom(() => {
  console.log('触底啦~~~~~')
})
</script>

<style scoped lang="scss">
.Notified {
  width: 100%;
  // padding: 0 16px;
  overflow-y: scroll;
  position: relative;
}
.content {
  background: #f7f8fa;
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 16px;
  padding: 16px;
  &_item {
    padding: 8px 13px 16px;
    background: #ffffff;
    box-shadow: 0px 2px 12px 1px rgba(100, 101, 102, 0.12);
    border-radius: 4px 4px 4px 4px;
    &_header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 6px;
      &_left {
        display: flex;
        align-items: center;
        &_img {
          width: 32px;
          height: 32px;
          margin-right: 8px;
        }
        &_title {
          font-weight: bold;
          font-size: 16px;
          color: #323233;
        }
      }
      &_right {
        font-weight: 400;
        font-size: 12px;
        color: #999393;
      }
    }
    &_ctx {
      font-weight: 400;
      font-size: 14px;
      color: #5b5b5c;
    }
  }
}
.loadingPage {
  width: 100%;
  height: 10vh;
  @include CenterHorVertical();
}
</style>
