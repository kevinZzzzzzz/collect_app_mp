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
        <ExpressInfo :bloodInfo="orderDetail" :transStatus="+transStatus" />
      </div>

      <div class="CollectDetail_detail_block">
        <BoxList :bloodInfo="orderDetail" @openWeight="openWeightBox($event)" />
      </div>
    </div>
    <div class="CollectDetail_bottom" :style="{ zIndex: pageScroll ? 0 : 3 }">
      <div class="CollectDetail_bottom_ctx2" v-if="+transStatus === 6">
        <div class="CollectDetail_bottom_ctx2_left" @click="gotoError()">
          <wd-icon name="warning" color="#B7B7B8" size="22px"></wd-icon>
          <p class="CollectDetail_bottom_ctx2_left_text">异常</p>
        </div>
        <div
          :class="['CollectDetail_bottom_ctx2_right', notCollect && 'disabled']"
          @click="sureCollect()"
        >
          <p class="CollectDetail_bottom_ctx2_right_text">确定揽收</p>
        </div>
      </div>
      <div class="CollectDetail_bottom_ctx" v-if="+transStatus === 0">
        <div class="CollectDetail_bottom_ctx_btn" @click="goBackHome()">
          <p class="CollectDetail_bottom_ctx_btn_text">返回首页</p>
        </div>
      </div>
    </div>
  </div>
  <wd-popup v-model="showWeighBox" position="bottom" @close="closeWeighBox">
    <BoxWeigh v-if="showWeighBox" :weighBoxList="weighBoxList" @closeWeighBox="closeWeighBox" />
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
import { addTransOrder, getCollectItemDetail } from '@/service/index/collect'
import BoxWeigh from './components/BoxWeigh.vue'
import PLATFORM from '@/utils/platform'
import { transStatusMap } from '@/constant'

const isMp = ref(PLATFORM.isMp)
defineOptions({
  name: 'CollectDetail',
})
const store = globalSettingStore() // 全局设置
const { pageScroll } = storeToRefs(store)
const outboundOrderNo = ref({}) // 交接单号
const transStatus = ref(0) // 运单状态
const orderDetail = ref<any>({}) // 交接单详情

const showWeighBox = ref(false) // 展示称重弹窗
const weighBoxList = ref([]) // 称重数据

/**
 * 打开称重弹窗
 * @param data
 */
const openWeightBox = (data) => {
  store.changePageScroll(true)
  weighBoxList.value = (data && [data]) || []
  showWeighBox.value = true // 打开称重弹窗
}

// 关闭称重弹窗
const closeWeighBox = (data) => {
  showWeighBox.value = false
  store.changePageScroll(false)
  weighBoxList.value = []
  if (data && data.length) {
    orderDetail.value.eventNoPackageArr.forEach((item, idx) => {
      data.forEach((d) => {
        if (d.code === item.code) {
          item.weight = d.weight
        }
      })
    })
  }
}

/**
 * 确定揽收
 */
const sureCollect = () => {
  if (notCollect.value) return
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
  addTransOrder(params).then((res: any) => {
    console.log(res, 'res')
    uni.navigateTo({
      url: `/packageA/collect/result?outboundOrderNo=${orderDetail.value.outboundOrderNo}}`,
    })
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
const goBackHome = () => {
  uni.reLaunch({ url: '/' })
}
onMounted(() => {
  const options: any = getCurrentInstance()
  outboundOrderNo.value = getNavigateOptions(options, 'outboundOrderNo')
  transStatus.value = getNavigateOptions(options, 'transStatus') || ''
  const showWeight = getNavigateOptions(options, 'showWeight') || ''
  uni.setNavigationBarTitle({
    title: transStatusMap[transStatus.value].text,
  })
  getCollectItemDetail({
    outboundOrderNo: outboundOrderNo.value,
  }).then((res: any) => {
    const { data } = res
    if (data) {
      const arr = []
      if (data.eventNoPackageMap) {
        Object.keys(data.eventNoPackageMap).forEach((item: any, idx) => {
          data.eventNoPackageMap[item]?.forEach((d, index) => {
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
    console.log(orderDetail.value, 'orderDetail0000000')

    if (+showWeight && orderDetail.value.eventNoPackageArr?.length) {
      openWeightBox(orderDetail.value.eventNoPackageArr[0])
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
    padding: 10px 16px;
    background: #fff;
    &_ctx {
      display: grid;
      grid-template-columns: 1fr;

      &_btn {
        padding: 10px 0;
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
    &_ctx2 {
      display: grid;
      grid-template-columns: 0.15fr 1fr;
      grid-gap: 16px;
      width: 100%;
      &_left {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        background: #fff;
        border-radius: 4px;
        &_text {
          font-size: 14px;
          color: #999999;
        }
      }
      &_right {
        padding: 10px 0;
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
