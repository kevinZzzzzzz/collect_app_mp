<template>
  <div class="CollectDetail">
    <div class="CollectDetail_header">
      <MapComp />
    </div>
    <div class="CollectDetail_detail">
      <div class="CollectDetail_detail_block">
        <BloodInfo :bloodInfo="orderDetail" />
      </div>

      <div class="CollectDetail_detail_block">
        <ExpressInfo :bloodInfo="orderDetail" />
      </div>

      <div class="CollectDetail_detail_block">
        <BoxList :bloodInfo="orderDetail" @weighBox="weighBox($event)" />
      </div>
    </div>
    <div class="CollectDetail_bottom">
      <div class="CollectDetail_bottom_left">
        <wd-icon name="warning" color="#B7B7B8" size="22px"></wd-icon>
        <p class="CollectDetail_bottom_left_text">异常</p>
      </div>
      <div class="CollectDetail_bottom_right">
        <p class="CollectDetail_bottom_right_text" @click="sureCollect()">确定揽收</p>
      </div>
    </div>
  </div>
  <wd-popup v-model="showWeighBox" position="bottom" @close="showWeighBox = false">
    <BoxWeigh :weighBoxInfo="weighBoxInfo" @closeWeighBox="closeWeighBox" />
  </wd-popup>
</template>

<script setup lang="ts">
import { onMounted, ref, getCurrentInstance } from 'vue'
import MapComp from '@/components/MapComp.vue'
import BoxWeigh from '@/components/BoxWeigh.vue'
import BloodInfo from './components/BloodInfo.vue'
import ExpressInfo from './components/ExpressInfo.vue'
import BoxList from './components/BoxList.vue'
import { getNavigateOptions } from '@/utils/index'
defineOptions({
  name: 'CollectDetail',
})
const outboundOrderNo = ref({}) // 交接单号
const orderDetail = ref({}) // 交接单详情

const showWeighBox = ref(false) // 展示称重弹窗
const weighBoxInfo = ref([]) // 称重数据

const weighBox = (data) => {
  if (!data) {
    closeWeighBox()
    return false
  }
  showWeighBox.value = true
  weighBoxInfo.value = data
}
const closeWeighBox = () => {
  showWeighBox.value = false
  weighBoxInfo.value = []
}
const sureCollect = () => {
  uni.navigateTo({
    url: '/packageA/collect/result',
  })
}
onMounted(() => {
  const options: any = getCurrentInstance()
  outboundOrderNo.value = getNavigateOptions(options, 'outboundOrderNo')
  const titleName: string = getNavigateOptions(options, 'tabs') || ''
  uni.setNavigationBarTitle({
    title: titleName,
  })
  import('./detail.json').then(({ default: res }) => {
    const { data } = res
    orderDetail.value = data
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
    z-index: -1;
    width: 100%;
    height: 142px;
  }
  &_detail {
    position: absolute;
    top: 114px;
    // z-index: 0;
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
    // z-index: 1;
    display: grid;
    grid-template-columns: 0.15fr 1fr;
    grid-gap: 16px;
    width: 100%;
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
}
</style>
