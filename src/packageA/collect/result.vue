<route lang="json5">
{
  style: {
    navigationBarTitleText: '血液揽收',
  },
}
</route>
<template>
  <page-meta :page-style="'overflow:' + (pageScroll && isMp ? 'hidden' : 'visible')"></page-meta>
  <div class="CollectResult">
    <div class="CollectResult_header">
      <image class="CollectResult_header_img" src="@img/succResultIcon.png" mode="scaleToFill" />
      <p class="CollectResult_header_text">揽收成功</p>
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
    <div class="CollectResult_btm">
      <div class="CollectResult_btm_item CollectResult_btm_item-left">
        <div class="CollectResult_btm_item_text CollectResult_btm_item_text-left" @click="backHome">
          返回首页
        </div>
      </div>
      <div class="CollectResult_btm_item CollectResult_btm_item-right">
        <div
          class="CollectResult_btm_item_text CollectResult_btm_item_text-right"
          @click="startTrans"
        >
          开始启运
        </div>
      </div>
    </div>
  </div>
  <wd-popup
    v-model="startTransConfirm"
    position="center"
    custom-style="border-radius: 10px"
    @close="handleStartTransConfirm(false)"
  >
    <div class="startTransBlock">
      <div class="startTransBlock_header">
        <div class="startTransBlock_header_text">请选择</div>
        <div class="startTransBlock_header_cancel" @click="handleStartTransConfirm(false)">
          取消
        </div>
      </div>
      <div class="startTransBlock_content">
        <div
          class="startTransBlock_content_item"
          v-for="(item, idx) in orderPackageList"
          :key="item.code"
        >
          <div class="startTransBlock_content_item_top">
            <image
              class="startTransBlock_content_item_top_img"
              src="@img/transBoxIcon.png"
              mode="scaleToFill"
            />
            <p class="startTransBlock_content_item_top_text">
              {{ item.code }}
            </p>
          </div>
          <div class="startTransBlock_content_item_line">
            <div class="startTransBlock_content_item_line_label">无人机编号:</div>
            <div
              class="startTransBlock_content_item_line_value"
              @click="openUAVSelPopup(item.droneCode, idx)"
            >
              <p class="startTransBlock_content_item_line_value_text">
                {{ item.droneCode || '请选择' }}
              </p>
              <wd-icon name="arrow-right" size="16px"></wd-icon>
            </div>
          </div>
        </div>
      </div>
      <div class="startTransBlock_bottom">
        <div class="startTransBlock_bottom_btn" @click="confirmUAV">
          <div class="startTransBlock_bottom_btn_text">确认启运</div>
        </div>
      </div>
    </div>
  </wd-popup>
  <!-- 无人机选择弹窗 -->
  <wd-popup
    v-model="showUAVSelectPopup"
    position="bottom"
    custom-style="padding: 30px 40px;"
    @close="closeUAVSelPopup"
  >
    <div class="UAVSelectPopup">
      <div class="UAVSelectPopup_header">
        <div class="UAVSelectPopup_header_left" @click="closeUAVSelPopup">取消</div>
        <div class="UAVSelectPopup_header_center">无人机编号</div>
        <div class="UAVSelectPopup_header_right" @click="makeSureUAV">确认</div>
      </div>
      <wd-picker-view :columns="UAVColumnsList" v-model="UAVSelectPopupValue" />
    </div>
  </wd-popup>
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
import {
  $apiGetCollectItemDetail,
  $apiGetAssetCode,
  $apiStartTransOrder,
} from '@/service/index/collect'
import { getNavigateOptions } from '@/utils'
import { ref } from 'vue'
import BoxList from './components/BoxList.vue'
import { globalSettingStore } from '@/store/global'
import { storeToRefs } from 'pinia'
import { isMp } from '@/utils/platform'
import BoxTemp from './components/BoxTemp.vue'

defineOptions({
  name: 'CollectResult',
})
const store = globalSettingStore() // 全局设置
const { pageScroll } = storeToRefs(store)
const outboundOrderNo = ref('') // 交接单号
const orderDetail = ref<any>({}) // 交接单详情

const showUAVSelectPopup = ref(false) // 打开选择弹窗
const UAVSelectPopupValue = ref('') // 选择弹窗选中值
const UAVSelectPopupIdx = ref(null) // 选择无人机操作索引
const UAVColumnsList = ref([]) // 无人机编号列表
const startTransConfirm = ref(false) // 启运确认()
const orderPackageList = ref([]) // 揽件信息
const showTempBox = ref(false) // 展示温度曲线弹窗
const tempBoxList = ref([]) // 温度曲线数据

/**
 * 确认是否启运
 * @param flag
 */
const handleStartTransConfirm = (flag) => {
  startTransConfirm.value = flag
}
/**
 * 开始启运
 *
 */
const startTrans = () => {
  handleStartTransConfirm(true)
}
/**
 * 打开选择无人机编号弹窗
 * @param code 无人机编号
 * @param idx 操作索引
 */
const openUAVSelPopup = (code, idx) => {
  showUAVSelectPopup.value = true
  UAVSelectPopupValue.value = code || UAVColumnsList.value[0] || ''
  UAVSelectPopupIdx.value = idx
}
/**
 * 关闭选择无人机编号弹窗
 */
const closeUAVSelPopup = () => {
  showUAVSelectPopup.value = false
  UAVSelectPopupValue.value = ''
}

/**
 * 确认选择无人机编号
 */
const makeSureUAV = () => {
  orderPackageList.value[UAVSelectPopupIdx.value].droneCode = UAVSelectPopupValue.value
  closeUAVSelPopup()
}

/**
 * 确认启运
 */
const confirmUAV = () => {
  const isOk = orderPackageList.value.every((e) => e.droneCode)
  if (!isOk) {
    uni.showToast({
      title: '请选择无人机编号',
      icon: 'none',
    })
  } else {
    let params = []
    orderPackageList.value.forEach((d) => {
      params.push({
        transportOrderNo: outboundOrderNo.value,
        transportMachineType: 'UAV',
        transportMachineCode: d.droneCode,
        packageRelationNoSet: [d.code],
      })
    })
    $apiStartTransOrder(params).then((res: any) => {
      handleStartTransConfirm(false)
      backHome()
    })
  }
  //
  // 启运接口
  // $apiStartTrans({
  //   outboundOrderNo: outboundOrderNo.value,
  //   outboundStatus: 3,
  //   eventNoPackageArr: orderPackageList.value,
  // }).then((res: any) => {
  //   const { data } = res
}

/**
 * 温度曲线
 * */
const openTempBox = (obj) => {
  // tempBoxList.value = props.orderItem.bloodPackages || []
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
/**
 * 获取资产编号
 */
const getAssetCode = () => {
  $apiGetAssetCode().then((res: any) => {
    const { data } = res
    UAVColumnsList.value = data || []
  })
}
onMounted(() => {
  const options: any = getCurrentInstance()
  outboundOrderNo.value = getNavigateOptions(options, 'outboundOrderNo')

  $apiGetCollectItemDetail({
    outboundOrderNo: outboundOrderNo.value,
    outboundStatus: 3,
  }).then((res: any) => {
    const { data } = res
    if (data) {
      const arr = []
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
  getAssetCode()
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
    grid-template-columns: 1fr 1fr;
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
