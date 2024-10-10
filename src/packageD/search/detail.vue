<route lang="json5">
{
  needLogin: true,
}
</route>
<template>
  <page-meta :page-style="'overflow:' + (pageScroll && isMp ? 'hidden' : 'visible')"></page-meta>
  <div class="CollectDetail">
    <div class="CollectDetail_header">
      <MapComp :bloodInfo="orderDetail" />
    </div>
    <div class="CollectDetail_detail">
      <div class="CollectDetail_detail_block">
        <BloodInfo :bloodInfo="orderDetail" />
      </div>

      <div class="CollectDetail_detail_block">
        <ExpressInfo :bloodInfo="orderDetail" />
      </div>

      <div class="CollectDetail_detail_block">
        <!-- 详情界面只有在待揽收状态才能修改称重，其余情况仅显示温度曲线 -->
        <!--  :showTempAndTime="+orderDetail.transportStatus !== 6" -->
        <BoxList
          :bloodInfo="orderDetail"
          noEditWeight
          @weighBox="weighBox($event)"
          @tempBox="openTempBox($event)"
        />
      </div>
    </div>
  </div>
  <!-- 温度弹窗 -->
  <wd-popup v-model="showTempBox" position="bottom" @close="closeTempBox">
    <BoxTemp
      v-if="showTempBox"
      lock-scroll
      :outboundOrderNo="orderDetail.outboundOrderNo"
      :safe-area-inset-bottom="true"
      :tempBoxList="tempBoxList"
      @closeTempBox="closeTempBox"
    />
  </wd-popup>
</template>

<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { onMounted, ref, getCurrentInstance } from 'vue'
import MapComp from '@/components/MapComp.vue'
import BloodInfo from '../components/BloodInfo.vue'
import ExpressInfo from '../components/ExpressInfo.vue'
import BoxList from '../components/BoxList.vue'
import { getNavigateOptions } from '@/utils/index'
import { globalSettingStore } from '@/store/global'
import { storeToRefs } from 'pinia'
import {
  $apiAddTransOrder,
  $apiGetCollectItemDetail,
  $apiGetAssetCode,
  $apiStartTransOrder,
} from '@/service/index/collect'
import { isMp } from '@/utils/platform'
import BoxTemp from '../components/BoxTemp.vue'
import { transStatusMap, transStatusTextMap } from '@/constant'

defineOptions({
  name: 'CollectDetail',
})
const store = globalSettingStore() // 全局设置
const { pageScroll } = storeToRefs(store)
const outboundOrderNo = ref({}) // 交接单号
const orderDetail = ref<any>({}) // 交接单详情
const tranStatus = ref(null) // 交接单状态

const showWeighBox = ref(false) // 展示称重弹窗
const weighBoxInfo = ref([]) // 称重数据
const showTempBox = ref(false) // 展示温度曲线弹窗
const tempBoxList = ref([]) // 温度曲线数据

const showUAVSelectPopup = ref(false) // 打开选择弹窗
const UAVSelectPopupValue = ref('') // 选择弹窗选中值
const UAVSelectPopupIdx = ref(null) // 选择无人机操作索引
const UAVColumnsList = ref([]) // 无人机编号列表
const startTransConfirm = ref(false) // 启运确认()
const orderPackageList = ref([]) // 揽件信息
/**
 * 打开称重弹窗
 */
const weighBox = (data) => {
  weighBoxInfo.value = (data && [data]) || []
  showWeighBox.value = true // 打开称重弹窗
  store.changePageScroll(true)
}
/**
 * 关闭称重弹窗，并且支持保存更新数据
 */
const closeWeighBox = (data) => {
  showWeighBox.value = false
  weighBoxInfo.value = []
  store.changePageScroll(false)

  if (data) {
    const temp = orderDetail.value.eventNoPackageArr
    temp.forEach((e, idx) => {
      data.forEach((d) => {
        if (d.code == e.code) {
          orderDetail.value.eventNoPackageArr[idx] = d
        }
      })
    })
  }
}

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
 * 跳转到异常页面
 */
const gotoError = () => {
  uni.navigateTo({
    url: `/packageA/collect/error?outboundOrderNo=${orderDetail.value.outboundOrderNo}&tranStatus=${tranStatus.value}`,
  })
}
/**
 * 返回首页
 */
const backHome = () => {
  uni.reLaunch({ url: '/pages/index/index' })
}

/**
 * 确认是否启运
 * @param flag
 */
const handleStartTransConfirm = (flag) => {
  startTransConfirm.value = flag
  store.changePageScroll(flag)
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
  store.changePageScroll(true)
  UAVSelectPopupValue.value = code || UAVColumnsList.value[0] || ''
  UAVSelectPopupIdx.value = idx
}
/**
 * 关闭选择无人机编号弹窗
 */
const closeUAVSelPopup = () => {
  showUAVSelectPopup.value = false
  UAVSelectPopupValue.value = ''
  store.changePageScroll(false)
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
    const params = []
    orderPackageList.value.forEach((d) => {
      params.push({
        transportOrderNo: orderDetail.value.transportOrderNo,
        transportMachineType: 'UAV',
        transportMachineCode: d.droneCode,
        packageRelationNoSet: [d.code],
      })
    })
    $apiStartTransOrder(params).then((res: any) => {
      handleStartTransConfirm(false)
      setTimeout(() => {
        uni.redirectTo({
          url: `/packageC/sign/detail?outboundOrderNo=${outboundOrderNo.value}&tranStatus=1`,
        })
      }, 1000)
    })
  }
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
onShow(() => {
  const options: any = getCurrentInstance()
  outboundOrderNo.value = getNavigateOptions(options, 'outboundOrderNo')
  tranStatus.value = getNavigateOptions(options, 'tranStatus') || ''
  const showWeight = getNavigateOptions(options, 'showWeight')
  $apiGetCollectItemDetail({
    outboundOrderNo: outboundOrderNo.value,
    outboundStatus: tranStatus.value,
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
    uni.setNavigationBarTitle({
      title: transStatusMap[orderDetail.value.transportStatus]?.text,
    })
    if (+showWeight) {
      showWeighBox.value = true
      weighBoxInfo.value = [orderDetail.value.eventNoPackageArr[0]] || []
    }
    // 获取无人机设备
    if (+orderDetail.value.transportStatus === 0) {
      orderPackageList.value =
        orderDetail.value?.eventNoPackageArr.map((d) => {
          return {
            ...d,
            droneCode: '',
          }
        }) || []
      getAssetCode()
    }
  })
})
</script>

<style scoped lang="scss">
page {
  background: #f7f8fa;
}
.CollectDetail {
  position: relative;
  width: 100%;
  &_header {
    position: absolute;
    top: 0;
    z-index: 1;
    width: 100%;
    height: 142px;
  }
  &_detail {
    position: absolute;
    top: 114px;
    z-index: 2;
    width: 100%;
    padding: 0px 16px 60px;
    &_block {
      padding: 8px 12px 10px;
      margin-bottom: 16px;
      background: #ffffff;
      border-radius: 4px 4px 4px 4px;
      box-shadow: 0px 2px 12px 1px rgba(100, 101, 102, 0.12);
    }
  }
  &_bottom {
    position: fixed;
    bottom: 0px;
    width: 100%;
    &_ctx {
      width: 100%;
      display: grid;
      grid-template-columns: 0.15fr 1fr;
      grid-gap: 16px;
      padding: 10px 16px;
      background: #fff;
      &_left {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 40px;
        background: #fff;
        border-radius: 4px;
        &_text {
          font-size: 14px;
          color: #999999;
        }
      }
      &_right {
        @include CenterHorVertical();
        background: #1890ff;
        border-radius: 4px 4px 4px 4px;
        &_text {
          font-size: 16px;
          font-weight: 400;
          color: #ffffff;
        }
      }
    }
    &_ctx1 {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr;
      padding: 10px 16px;
      background: #fff;
      &_btn {
        height: 40px;
        @include CenterHorVertical();
        background: #1890ff;
        border-radius: 4px 4px 4px 4px;
        &_text {
          font-size: 16px;
          font-weight: 400;
          color: #ffffff;
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
