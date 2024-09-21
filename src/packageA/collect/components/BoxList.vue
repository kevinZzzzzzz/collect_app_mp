<template>
  <div class="BoxList">
    <div class="BoxList_header">
      <p class="BoxList_header_title">揽件信息</p>
      <p class="BoxList_header_right">{{ boxAmount }}箱</p>
    </div>
    <div class="Waybill">
      <div class="Waybill_main">
        <div
          class="Waybill_main_boxItem"
          v-for="(item, idx) in bloodInfoRef.eventNoPackageArr"
          :key="`${idx}${updateFlag}`"
        >
          <!-- 运输编号单组件 -->
          <!-- <div class="Waybill_main_boxItem_header">
          <image
            class="Waybill_main_boxItem_header_img"
            src="@img/uavUnSel.png"
            mode="scaleToFill"
          />
          <div class="Waybill_main_boxItem_header_text">粤B XY008</div>
        </div> -->
          <BoxListInfo :boxItem="item" @setWeight="setWeigh(item)" />
          <div class="Waybill_main_btm" v-if="!item.weight">
            <div class="Waybill_main_btm_btn Waybill_main_btm_btn-left disabled">温度曲线</div>
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
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { transStatusMap } from '@/constant/index'
import { globalSettingStore } from '@/store/global'
import BoxListInfo from './BoxListInfo.vue'
import BoxWeigh from './BoxWeigh.vue'
defineOptions({
  name: 'BoxList', // 揽件信息
})

const store = globalSettingStore()
const props = defineProps({
  bloodInfo: {
    type: Object,
    default: () => {
      return {}
    },
  },
})
const bloodInfoRef = ref<any>({})
watch(
  () => props.bloodInfo,
  (n, o) => {
    bloodInfoRef.value = n
  },
  {
    deep: true,
  },
)

const showWeighBox = ref(false) // 展示称重弹窗
const weighBoxList = ref([]) // 称重数据
const updateFlag = ref(0)
const emit = defineEmits(['weighBox'])
const boxAmount = computed(() => {
  return (
    (bloodInfoRef.value.eventNoPackageMap &&
      Object.keys(bloodInfoRef.value.eventNoPackageMap).length) ||
    0
  )
})
/**
 * 称重
 * @param obj 单例对象
 */
const setWeigh = (obj) => {
  if (!obj.hasOwnProperty('weight')) {
    obj.weight = null
  }
  weighBoxList.value = (obj && [obj]) || []
  showWeighBox.value = true // 打开称重弹窗
  store.changePageScroll(true)
}
// 关闭称重弹窗
const closeWeighBox = (data) => {
  showWeighBox.value = false
  store.changePageScroll(false)
  if (data || +data === 0) {
    weighBoxList.value[0].weight = data
  }
  // 强制刷新组件(优化点！！！！组件设计复杂了，后期修复)
  updateFlag.value += 1
  weighBoxList.value = []
}
</script>

<style scoped lang="scss">
.BoxList {
  &_header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 10px;
    &_title {
      position: relative;
      margin-left: 9px;
      font-size: 17px;
      font-weight: bold;
      color: #323233;
    }
    &_title::before {
      position: absolute;
      top: 5px;
      left: -9px;
      width: 3px;
      height: 14px;
      content: '';
      background: #1890ff;
      border-radius: 5px 5px 5px 5px;
    }
  }
  &_list {
    display: grid;
    grid-auto-columns: 1fr;
    grid-gap: 16px;
    width: 100%;
    &_time {
      width: 100%;
      margin-top: 3px;
      font-size: 12px;
      font-weight: 400;
      color: #999393;
      text-align: left;
    }
    &_btm {
      width: 100%;
      margin-top: 9px;

      &_btn {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 26px;
        font-size: 14px;
        font-weight: 400;
        &_left {
          color: #1890ff;
          background: #ffffff;
          border: 1px solid #1890ff;
          border-radius: 4px;
        }
        &_right {
          color: #ffffff;
          background: #1890ff;
          border-radius: 4px;
        }
      }
    }
  }
}
.orderBtn {
  width: 100%;
  height: 30px;
  // background: #ffffff;
  @include CenterHorVertical();
}
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
