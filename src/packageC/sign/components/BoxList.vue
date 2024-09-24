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
          <BoxListInfo showTempAndTime :boxItem="item" @setTemps="setTemp($event)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import BoxListInfo from './BoxListInfo.vue'
defineOptions({
  name: 'BoxList', // 揽件信息
})

const props = defineProps({
  bloodInfo: {
    type: Object,
    default: () => {
      return {}
    },
  },
  noEditWeight: {
    // 是否禁止编辑重量
    type: Boolean,
    default: false,
  },
  showTempAndTime: {
    // 展示温度曲线在时间同行
    type: Boolean,
    default: false,
  },
})
const bloodInfoRef = ref<any>(props.bloodInfo)
watch(
  () => props.bloodInfo,
  (n) => {
    bloodInfoRef.value = n
  },
  {
    deep: true,
  },
)
const emit = defineEmits(['tempBox'])
const boxAmount = computed(() => {
  return (
    (bloodInfoRef.value.eventNoPackageArr &&
      Object.keys(bloodInfoRef.value.eventNoPackageArr).length) ||
    0
  )
})
/**
 * 查看温度曲线
 * @param obj 单例对象
 */
const setTemp = (obj) => {
  emit('tempBox', JSON.parse(JSON.stringify(obj)))
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
