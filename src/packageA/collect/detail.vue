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
        <ExpressInfo :tranStatus="tranStatus" :bloodInfo="orderDetail" />
      </div>

      <div class="CollectDetail_detail_block">
        <BoxList
          :bloodInfo="orderDetail"
          :noEditWeight="+tranStatus !== 6"
          :showTempAndTime="+tranStatus !== 6"
          @weighBox="weighBox($event)"
          @tempBox="openTempBox($event)"
        />
      </div>
    </div>
    <div class="CollectDetail_bottom" :style="{ zIndex: pageScroll ? 0 : 3 }">
      <div class="CollectDetail_bottom_ctx" v-if="+tranStatus === 6">
        <div class="CollectDetail_bottom_ctx_left" @click="gotoError()">
          <wd-icon name="warning" color="#B7B7B8" size="22px"></wd-icon>
          <p class="CollectDetail_bottom_ctx_left_text">异常</p>
        </div>
        <div
          :class="['CollectDetail_bottom_ctx_right', notCollect && 'disabled']"
          @click="sureCollect()"
        >
          <p class="CollectDetail_bottom_ctx_right_text">确定揽收</p>
        </div>
      </div>
      <div class="CollectDetail_bottom_ctx1" v-else>
        <div class="CollectDetail_bottom_ctx1_btn" @click="backHome">
          <p class="CollectDetail_bottom_ctx1_btn_text">返回首页</p>
        </div>
      </div>
    </div>
  </div>
  <wd-popup v-model="showWeighBox" position="bottom" @close="closeWeighBox">
    <BoxWeigh :weighBoxList="weighBoxInfo" @closeWeighBox="closeWeighBox" />
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
import { onMounted, ref, getCurrentInstance } from 'vue'
import MapComp from '@/components/MapComp.vue'
import BloodInfo from './components/BloodInfo.vue'
import ExpressInfo from './components/ExpressInfo.vue'
import BoxList from './components/BoxList.vue'
import { getNavigateOptions } from '@/utils/index'
import { globalSettingStore } from '@/store/global'
import { storeToRefs } from 'pinia'
import { $apiAddTransOrder, $apiGetCollectItemDetail } from '@/service/index/collect'
import { isMp } from '@/utils/platform'
import BoxWeigh from './components/BoxWeigh.vue'
import BoxTemp from './components/BoxTemp.vue'
import { transStatusMap } from '@/constant'

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
    // console.log(orderDetail.value.eventNoPackageArr, 'orderDetail.value00000')
  }
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
 * 确定揽收
 */
const sureCollect = () => {
  if (notCollect.value) return
  console.log(orderDetail.value)
  // let weightMap = {}
  // orderDetail.value.eventNoPackageArr.forEach((e) => {
  //   weightMap[e.code] = e.weight
  // })
  let params = {
    outboundOrderNo: orderDetail.value.outboundOrderNo,
    OrderType: 2,
    transportPackages: [],
  }
  orderDetail.value.eventNoPackageArr.forEach((e) => {
    let obj = {
      packageRelationNo: e.code,
      weight: e.weight,
      cargoList: [],
    }
    if (e.bloodBagGroupMap) {
      Object.values(e.bloodBagGroupMap).forEach((item: Array<any>) => {
        item.forEach((ele) => {
          obj.cargoList.push({
            cargoType: 1,
            cargoRelationNo: ele.bloodBagId,
          })
        })
      })
    }
    params.transportPackages.push(obj)
  })
  $apiAddTransOrder(params).then((res: any) => {
    console.log(res, 'res')
    // uni.navigateTo({
    //   url: `/packageA/collect/result?outboundOrderNo=${orderDetail.value.outboundOrderNo}&weightMap=${JSON.stringify(weightMap)}`,
    // })
  })
}
/**
 * 跳转到异常页面
 */
const gotoError = () => {
  uni.navigateTo({
    url: '/packageA/collect/error',
  })
}
// 是否可揽收
const notCollect = computed(() => {
  return (
    orderDetail.value?.eventNoPackageArr &&
    orderDetail.value?.eventNoPackageArr.some((e) => !e.weight)
  )
})
/**
 * 返回首页
 */
const backHome = () => {
  uni.navigateTo({ url: '/' })
}
onMounted(() => {
  const options: any = getCurrentInstance()
  outboundOrderNo.value = getNavigateOptions(options, 'outboundOrderNo')
  tranStatus.value = getNavigateOptions(options, 'tranStatus') || ''
  const showWeight = getNavigateOptions(options, 'showWeight')
  uni.setNavigationBarTitle({
    title: transStatusMap[tranStatus.value].text,
  })
  $apiGetCollectItemDetail({
    outboundOrderNo: outboundOrderNo.value,
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
    // console.log(orderDetail.value, 'orderDetail0000000')
    if (+showWeight) {
      showWeighBox.value = true
      weighBoxInfo.value = [orderDetail.value.eventNoPackageArr[0]] || []
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
</style>
