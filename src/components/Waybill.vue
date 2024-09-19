<template>
  <div class="Waybill">
    <!-- <div class="Waybill_header"></div> -->
    <div class="Waybill_main">
      <div
        class="Waybill_main_boxItem"
        v-for="(item, idx) in props.orderItem.bloodPackages"
        :key="idx"
      >
        <!-- 运输编号单组件 -->
        <div class="Waybill_main_boxItem_header">
          <image
            class="Waybill_main_boxItem_header_img"
            src="@img/uavUnSel.png"
            mode="scaleToFill"
          />
          <div class="Waybill_main_boxItem_header_text">粤B XY008</div>
        </div>
        <BoxListInfo :boxItem="item" @setWeight="setWeigh(item)" />
        <div class="Waybill_main_btm">
          <div class="Waybill_main_btm_btn Waybill_main_btm_btn-left">温度曲线</div>
          <div class="Waybill_main_btm_btn Waybill_main_btm_btn-right" @click="setWeigh(item)">
            称重
          </div>
        </div>
      </div>
    </div>
  </div>
  <wd-popup v-model="showWeighBox" position="bottom" @close="closeWeighBox">
    <BoxWeigh :weighBoxList="weighBoxList" @closeWeighBox="closeWeighBox" />
  </wd-popup>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { transStatusMap } from '@/constant/index'
import BoxListInfo from './BoxListInfo.vue'
import BoxWeigh from './BoxWeigh.vue'
defineOptions({
  name: 'Waybill', // 运输编号单
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
const weighBoxList = ref([]) // 称重数据

/**
 * 称重
 * @param obj 单例对象
 */
const setWeigh = (obj) => {
  weighBoxList.value = (obj && [obj]) || []
  showWeighBox.value = true // 打开称重弹窗
}
// 关闭称重弹窗
const closeWeighBox = () => {
  showWeighBox.value = false
  weighBoxList.value = []
}
</script>

<style scoped lang="scss">
.Waybill {
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
    &_boxItem {
      padding: 10px 12px 12px;
      background: #ffffff;
      box-shadow: 0px 2px 12px 1px rgba(100, 101, 102, 0.12);
      border-radius: 4px 4px 4px 4px;
      margin-top: 16px;
      &_header {
        margin: -10px -12px 6px;
        width: calc(100% + 24px);
        height: 24px;
        background: #eef7ff;
        border-radius: 4px 4px 0px 0px;
        padding: 2px 10px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        &_img {
          width: 12px;
          height: 12px;
        }
        &_text {
          margin-left: 3px;
          font-weight: 400;
          font-size: 12px;
          color: #1890ff;
        }
      }
    }
    &_btm {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 27px;
      &_btn {
        font-size: 14px;
        padding: 3px 0px;
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
