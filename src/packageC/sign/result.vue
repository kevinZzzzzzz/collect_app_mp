<route lang="json5">
{
  style: {
    navigationBarTitleText: '血液签收',
  },
  needLogin: true,
}
</route>
<template>
  <page-meta :page-style="'overflow:' + (pageScroll && isMp ? 'hidden' : 'visible')"></page-meta>
  <div class="CollectResult">
    <div class="CollectResult_header">
      <image class="CollectResult_header_img" src="@img/succResultIcon.png" mode="scaleToFill" />
      <p class="CollectResult_header_text">签收成功</p>
    </div>
    <div class="CollectResult_block">
      <div class="CollectResult_block_item">
        <div class="CollectResult_block_item_left">交接单号:</div>
        <div class="CollectResult_block_item_right">{{ orderDetail.outboundOrderNo }}</div>
      </div>
      <div class="CollectResult_block_item">
        <div class="CollectResult_block_item_left">运输单号:</div>
        <div class="CollectResult_block_item_right">{{ orderDetail.outboundOrderNo }}</div>
      </div>
      <div class="CollectResult_block_item">
        <div class="CollectResult_block_item_left">配送方式:</div>
        <div class="CollectResult_block_item_right">无人机配送</div>
      </div>
    </div>
    <div class="CollectResult_block">
      <div class="CollectResult_block_item">
        <div class="CollectResult_block_item_left">发送方:</div>
        <div class="CollectResult_block_item_right">{{ orderDetail.outboundApplicant }}</div>
      </div>
      <div class="CollectResult_block_item">
        <div class="CollectResult_block_item_left">接收方:</div>
        <div class="CollectResult_block_item_right">{{ orderDetail.outboundReceiver }}</div>
      </div>
    </div>
    <div class="CollectResult_block">
      <BoxList
        :bloodInfo="orderDetail"
        noEditWeight
        showTempAndTime
        @tempBox="openTempBox($event)"
      />
    </div>
    <div class="CollectResult_btm" @click="backHome">
      <div class="CollectResult_btm_item CollectResult_btm_item-right">
        <div class="CollectResult_btm_item_text CollectResult_btm_item_text-right">返回首页</div>
      </div>
    </div>
  </div>

  <wd-popup v-model="showTempBox" position="bottom" @close="closeTempBox">
    <BoxTemp
      v-if="showTempBox"
      lock-scroll
      :safe-area-inset-bottom="true"
      :tempBoxList="tempBoxList"
      @closeTempBox="closeTempBox"
    />
  </wd-popup>
</template>

<script setup lang="ts">
import { $apiGetCollectItemDetail } from '@/service/index/collect'
import { getNavigateOptions } from '@/utils'
import { getCurrentInstance, onMounted, ref } from 'vue'
import { globalSettingStore } from '@/store/global'
import { storeToRefs } from 'pinia'
import { isMp } from '@/utils/platform'
import BoxList from './components/BoxList.vue'
import BoxTemp from './components/BoxTemp.vue'

defineOptions({
  name: 'CollectResult',
})
const store = globalSettingStore() // 全局设置
const { pageScroll } = storeToRefs(store)
const outboundOrderNo = ref('') // 交接单号
const weightMap = ref('') // 重量映射表
const orderDetail = ref<any>({}) // 交接单详情

const orderPackageList = ref([]) // 揽件信息
const showTempBox = ref(false) // 展示温度曲线弹窗
const tempBoxList = ref([]) // 温度曲线数据

/**
 * 温度曲线
 * */
const openTempBox = (obj) => {
  tempBoxList.value = [obj] || []
  showTempBox.value = true // 打开温度曲线弹窗
  store.changePageScroll(true)
}

/**
 * 关闭温度曲线弹窗
 * */
const closeTempBox = () => {
  showTempBox.value = false
  tempBoxList.value = []
  store.changePageScroll(false)
}
/**
 * 返回首页
 */
const backHome = () => {
  uni.reLaunch({ url: '/pages/index/index' })
}
onMounted(() => {
  const options: any = getCurrentInstance()
  outboundOrderNo.value = getNavigateOptions(options, 'outboundOrderNo')
  weightMap.value = getNavigateOptions(options, 'weightMap') || ''

  $apiGetCollectItemDetail({
    outboundOrderNo: outboundOrderNo.value,
  }).then((res: any) => {
    const { data } = res
    if (data) {
      const arr: any = []
      if (data.eventNoPackageMap) {
        Object.keys(data.eventNoPackageMap).forEach((item, idx) => {
          data.eventNoPackageMap[item].forEach((d) => {
            arr.push({
              weight: null,
              eventNo: item,
              ...d,
            })
          })
        })
      }
      data.eventNoPackageArr = arr // 箱子信息列表
    }
    orderDetail.value = data
    orderPackageList.value =
      orderDetail.value?.eventNoPackageArr.map((d) => {
        return {
          ...d,
          droneCode: '',
        }
      }) || []
  })
})
</script>

<style scoped lang="scss">
page {
  background: #f7f8fa;
}
.CollectResult {
  padding: 32px 16px 60px;
  position: relative;
  &_header {
    @include CenterHorVertical();
    flex-direction: column;
    &_img {
      width: 80px;
      height: 80px;
      margin-bottom: 10px;
    }
    &_text {
      font-family: PingFang SC;
      font-weight: bold;
      font-size: 17px;
      color: #323233;
    }
  }
  &_block {
    width: 100%;
    margin-top: 16px;
    background: #ffffff;
    box-shadow: 0px 2px 12px 1px rgba(100, 101, 102, 0.12);
    border-radius: 4px 4px 4px 4px;
    padding: 16px;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 16px;
    &_item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 9px 0;
      &_left {
        font-weight: bold;
        font-size: 14px;
        color: #323233;
      }
      &_right {
        font-weight: bold;
        font-size: 14px;
        color: #323233;
      }
    }
  }
  &_btm {
    width: 100%;
    padding: 10px 16px;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 20px;
    background: #fff;
    position: fixed;
    bottom: 0px;
    left: 0;
    &_item {
      width: 100%;
      padding: 8px 0 10px;
      border-radius: 4px 4px 4px 4px;
      @include CenterHorVertical();
      &-left {
        border: 1px solid #1890ff;
      }
      &-right {
        border: 1px solid #1890ff;
        background: #1890ff;
      }
      &_text {
        font-family: PingFang SC;
        font-size: 14px;
        font-weight: 400;
        text-align: center;
        &-left {
          color: #1890ff;
        }
        &-right {
          color: #fff;
        }
      }
    }
  }
}
.startTransBlock {
  padding: 16px;
  width: 314px;
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
  &_content {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    // grid-gap: 1px;
    &_item {
      width: 100%;
      &_top {
        display: flex;
        align-items: center;
        padding: 10px 0px;
        &_img {
          width: 27px;
          height: 27px;
          margin-right: 10px;
        }
        &_text {
          font-weight: bold;
          font-size: 17px;
          color: #323233;
        }
      }
      &_line {
        width: 100%;
        padding: 5px 0;
        display: grid;
        grid-template-columns: 0.3fr 1fr;
        align-items: center;
        &_label {
          font-weight: 400;
          font-size: 12px;
          color: #323233;
        }
        &_value {
          padding: 0 0 0 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      }
    }
  }
  &_bottom {
    margin-top: 16px;
    width: 100%;
    &_btn {
      width: 100%;
      height: 40px;
      background: #1890ff;
      border-radius: 4px 4px 4px 4px;
      @include CenterHorVertical();
      &_text {
        font-weight: 400;
        font-size: 14px;
        color: #ffffff;
      }
    }
  }
}
.UAVSelectPopup {
  width: 100%;
  padding: 0 16px 0;
  &_header {
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
:deep(.wd-popup--bottom) {
  padding: 0 !important;
  border-radius: 10px 10px 0 0;
}
</style>
