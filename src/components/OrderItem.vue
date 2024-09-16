<template>
  <div class="OrderItem">
    <div class="OrderItem_header">
      <div class="OrderItem_header_left">
        <p class="OrderItem_header_left_text">交接单号：{{ orderItem.outboundOrderNo }}</p>
        <wd-tag custom-class="space" color="#EE0A24" bg-color="#EFDFE8">紧急</wd-tag>
      </div>
      <div class="OrderItem_header_right">
        <p class="OrderItem_header_right_text" :style="{ color: transStatusMap[0].color }">
          {{ transStatusMap[0].text }}
        </p>
      </div>
    </div>
    <div class="OrderItem_main">
      <div
        class="OrderItem_main_boxItem"
        v-for="(item, idx) in props.orderItem.bloodPackages"
        :key="idx"
        @click="goDetail"
      >
        <!-- 箱子信息组件 -->
        <BoxListInfo :boxItem="item" noEditWeight />
      </div>
      <div class="OrderItem_main_btm">
        <div class="OrderItem_main_btm_btn OrderItem_main_btm_btn-left" @click="setTemp">
          温度曲线
        </div>
        <div class="OrderItem_main_btm_btn OrderItem_main_btm_btn-right" @click="setWeigh">
          称重
        </div>
      </div>
    </div>
  </div>
  <wd-popup v-model="showWeighBox" position="bottom" @close="closeWeighBox">
    <BoxWeigh :weighBoxList="weighBoxList" @closeWeighBox="closeWeighBox" />
  </wd-popup>
  <wd-popup v-model="showTempBox" position="bottom" @close="closeTempBox">
    <BoxTemp @closeTempBox="closeTempBox" />
  </wd-popup>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { transStatusMap } from '@/constant/index'
import BoxListInfo from '@/components/BoxListInfo.vue'
import BoxWeigh from '@/components/BoxWeigh.vue'
import BoxTemp from '@/components/BoxTemp.vue'
defineOptions({
  name: 'OrderItem',
})
const props = defineProps({
  orderItem: {
    type: Object,
    default: () => {
      return {}
    },
  },
})
const showWeighBox = ref(false) // 展示称重弹窗
const showTempBox = ref(false) // 展示温度曲线弹窗
const weighBoxList = ref([]) // 称重数据
const tempBoxList = ref([]) // 温度曲线数据

/**
 * 称重
 */
const setWeigh = () => {
  weighBoxList.value = props.orderItem.bloodPackages || []
  showWeighBox.value = true // 打开称重弹窗
}
// 关闭称重弹窗
const closeWeighBox = () => {
  showWeighBox.value = false
  weighBoxList.value = []
}
/**
 * 温度曲线
 * */
const setTemp = () => {
  tempBoxList.value = props.orderItem.bloodPackages || []
  showTempBox.value = true // 打开温度曲线弹窗
}

/**
 * 关闭温度曲线弹窗
 * */
const closeTempBox = () => {
  showTempBox.value = false
  tempBoxList.value = []
}
/**
 * 跳转详情
 */
const goDetail = () => {
  uni.navigateTo({
    url: `/packageA/collect/detail?outboundOrderNo=${props.orderItem.outboundOrderNo}&tabs=待揽收`,
  })
}
</script>

<style scoped lang="scss">
.OrderItem {
  width: 100%;
  &_header {
    width: 100%;
    padding: 10px 12px 8px;
    background: #eef7ff;
    border-radius: 4px 4px 0px 0px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &_left {
      display: flex;
      align-items: center;
      &_text {
        margin-right: 10px;
        font-size: 14px;
        color: #323233;
      }
    }
  }
  &_main {
    padding: 0 12px 12px;
    background: #ffffff;
    box-shadow: 0px 2px 12px 1px rgba(100, 101, 102, 0.12);
    border-radius: 4px 4px 4px 4px;
    &_boxItem {
      padding: 10px 0;
    }
    &_btm {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 27px;
      &_btn {
        font-size: 14px;
        padding: 5px 0px;
        border-radius: 4px;
        border: 1px solid #1890ff;
        @include CenterHorVertical();
        &-left {
          color: #1890ff;
        }
        &-right {
          color: #ffffff;
          background: #1890ff;
        }
      }
      &_btn:active {
        opacity: 0.8;
      }
    }
  }
}
.wdPopup {
  border-radius: 20px 20px 0px 0px !important;
}
</style>
