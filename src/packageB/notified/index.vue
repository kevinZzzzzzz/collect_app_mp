<route lang="json5">
{
  style: {
    navigationBarTitleText: '消息通知',
  },
}
</route>
<template>
  <div class="Notified">
    <wd-tabs v-model="tab" inactiveColor="#CDCDCD" @click="handleChangTab">
      <block v-for="(item, index) in tabs" :key="index">
        <wd-tab :title="item" :name="item">
          <div class="loadingPage" v-if="isLoading">
            <wd-loading :size="30" />
          </div>
          <wd-status-tip
            v-if="!isLoading && notifyData && !notifyData.length"
            image="search"
            tip="暂无数据"
          />
          <view class="content">
            <div class="content_item" v-for="(item, index) in notifyData" :key="index">
              <div class="content_item_header">
                <div class="content_item_header_left">
                  <image
                    class="content_item_header_left_img"
                    src="@img/notifyIcon1.png"
                    mode="scaleToFill"
                  />
                  <p class="content_item_header_left_text">{{ item.title }}</p>
                </div>
                <div class="content_item_header_right">
                  {{ item.date }}
                </div>
              </div>
              <div class="content_item_main">
                <div class="content_item_main_line">
                  <p class="content_item_main_line_label">联系人：</p>
                  <p class="content_item_main_line_value">{{ item.contact }}</p>
                </div>
                <div class="content_item_main_line">
                  <p class="content_item_main_line_label">地址：</p>
                  <p class="content_item_main_line_value">{{ item.address }}</p>
                </div>
                <div class="content_item_main_line2">
                  {{ item.content }}
                </div>
                <div class="content_item_main_line" v-if="item.reason">
                  <p class="content_item_main_line_label">异常原因：</p>
                  <p class="content_item_main_line_value">{{ item.reason }}</p>
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
import { getCurrentInstance, onMounted, ref } from 'vue'
import { getNavigateOptions } from '@/utils/index'
defineOptions({
  name: 'Notified',
})
const notifiedTypeTabsMap = {
  揽收: ['全部', '待揽收通知', '告警提醒'],
  签收: ['全部', '待签收通知', '告警提醒'],
  交接: ['全部', '已揽收通知', '已签收通知', '告警提醒'],
}
const tabs = ref([]) // 标签页列表
const tab = ref('全部')
const isLoading = ref(false) // 加载中
const notifyData = ref([]) // 消息数据

const handleChangTab = () => {}
onMounted(() => {
  const options: any = getCurrentInstance()
  const notifiedType: string = getNavigateOptions(options, 'notifiedType') || '揽收'
  tabs.value = notifiedTypeTabsMap[notifiedType]
  isLoading.value = true

  import('./data.json').then((res: any) => {
    const { data } = res
    notifyData.value = data
    isLoading.value = false
  })
})
</script>

<style scoped lang="scss">
page {
  background: #f7f8fa;
}
.Notified {
  width: 100%;
  overflow-y: scroll;
}
.content {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 16px;
  padding: 16px;
  background: #f7f8fa;
  &_item {
    width: 100%;
    padding: 16px;
    background: #ffffff;
    box-shadow: 0px 2px 12px 1px rgba(100, 101, 102, 0.12);
    border-radius: 4px 4px 4px 4px;
    &_header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 5px;
      &_left {
        display: flex;
        align-items: center;
        &_img {
          width: 32px;
          height: 32px;
          margin-right: 8px;
        }
        &_text {
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
    &_main {
      display: grid;
      grid-template-columns: 1fr;
      grid-gap: 5px;
      &_line {
        font-weight: 400;
        font-size: 14px;
        color: #323233;
        display: grid;
        grid-template-columns: 0.3fr 1fr;
        grid-gap: 1px;
        &_label {
          text-align: right;
        }
      }
      &_line2 {
        font-weight: 400;
        font-size: 14px;
        color: #323233;
      }
    }
  }
}
</style>
