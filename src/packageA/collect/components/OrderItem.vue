<template>
  <div class="OrderItem">
    <div class="OrderItem_header">
      <div class="OrderItem_header_left">
        <p class="OrderItem_header_left_text">交接单号：{{ orderItem.handoverId }}</p>
        <!-- <wd-tag custom-class="space" color="#EE0A24" bg-color="#EFDFE8">紧急</wd-tag> -->
      </div>
      <div class="OrderItem_header_right">
        <p
          class="OrderItem_header_right_text"
          :style="{ color: transStatusMap[+orderItem.transportStatus].color }"
        >
          {{ transStatusMap[+orderItem.transportStatus].text }}
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
      <div
        :class="[
          'OrderItem_main_btm',
          +orderItem.transportStatus === 7 && 'OrderItem_main_btm-1line',
        ]"
        v-if="showBtnFlag"
      >
        <div class="OrderItem_main_btm_btn OrderItem_main_btm_btn-left" @click="setTemp">
          温度曲线
        </div>
        <div
          v-if="+orderItem.transportStatus === 6"
          class="OrderItem_main_btm_btn OrderItem_main_btm_btn-right"
          @click="setWeigh"
        >
          称重
        </div>
        <div
          v-if="![6, 7].includes(+orderItem.transportStatus)"
          class="OrderItem_main_btm_btn OrderItem_main_btm_btn-right"
          @click="goDetail"
        >
          物流跟踪
        </div>
      </div>
    </div>
  </div>
  <!-- 称重弹窗 -->
  <wd-popup v-model="showWeighBox" position="bottom" @close="closeWeighBox">
    <BoxWeigh
      v-if="showWeighBox"
      lock-scroll
      :safe-area-inset-bottom="true"
      :weighBoxList="weighBoxList"
      @closeWeighBox="closeWeighBox"
    />
  </wd-popup>
  <!-- 温度弹窗 -->
  <wd-popup v-model="showTempBox" position="bottom" @close="closeTempBox">
    <BoxTemp
      v-if="showTempBox"
      lock-scroll
      :outboundOrderNo="orderItem.outboundOrderNo"
      :safe-area-inset-bottom="true"
      :tempBoxList="tempBoxList"
      @closeTempBox="closeTempBox"
    />
  </wd-popup>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import { transStatusMap, transStatusValueMap } from '@/constant/index'
import BoxListInfo from './BoxListInfo.vue'
import BoxWeigh from './BoxWeigh.vue'
import BoxTemp from './BoxTemp.vue'
import { globalSettingStore } from '@/store/global'
defineOptions({
  name: 'OrderItem',
})
const store = globalSettingStore()

const props = defineProps({
  orderItem: {
    type: Object,
    default: () => {
      return {}
    },
  },
  transportStatus: {
    type: Number,
    default: () => {
      return 0
    },
  },
})
const showWeighBox = ref(false) // 展示称重弹窗
const weighBoxList = ref([]) // 称重数据
const showTempBox = ref(false) // 展示温度曲线弹窗
const tempBoxList = ref([]) // 温度曲线数据

// 判断展示操作按钮 没有箱子不显示操作按钮
const showBtnFlag = computed(() => {
  return (
    props.orderItem.bloodPackages.length &&
    props.orderItem.bloodPackages.every((d) => d.code !== '--')
  )
})
/**
 * 称重
 */
const setWeigh = () => {
  uni.navigateTo({
    url: `/packageA/collect/detail?outboundOrderNo=${props.orderItem.outboundOrderNo}&tranStatus=${props.transportStatus}&showWeight=1`,
  })
  // weighBoxList.value = props.orderItem.bloodPackages || []
  // showWeighBox.value = true // 打开称重弹窗
  // store.changePageScroll(true)
}
// 关闭称重弹窗
const closeWeighBox = () => {
  showWeighBox.value = false
  weighBoxList.value = []
  store.changePageScroll(false)
}
/**
 * 温度曲线
 * */
const setTemp = () => {
  tempBoxList.value = props.orderItem.bloodPackages || []
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
 * 跳转详情
 */
const goDetail = () => {
  // 需要签收
  if ([1, 2].includes(props.orderItem.transportStatus)) {
    uni.navigateTo({
      url: `/packageC/sign/detail?outboundOrderNo=${props.orderItem.outboundOrderNo}&tranStatus=${props.transportStatus}`,
    })
  } else {
    uni.navigateTo({
      url: `/packageA/collect/detail?outboundOrderNo=${props.orderItem.outboundOrderNo}&tranStatus=${props.transportStatus}`,
    })
  }
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
        font-weight: bold;
        margin-right: 10px;
        font-size: 14px;
        color: #323233;
      }
    }
    &_right {
      &_text {
        font-weight: bold;
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
      &-1line {
        grid-template-columns: 1fr;
      }
    }
  }
}
.wdPopup {
  border-radius: 20px 20px 0px 0px !important;
}
</style>
