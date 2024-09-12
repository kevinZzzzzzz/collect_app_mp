<template>
  <div class="ExpressInfo">
    <div class="ExpressInfo_header">
      <div class="ExpressInfo_header_receive">
        <p class="ExpressInfo_header_receive_text">收</p>
      </div>
      <p class="ExpressInfo_header_info">沈锦艺</p>
      <p class="ExpressInfo_header_info">15788755934</p>
    </div>
    <ul class="ExpressInfo_precess">
      <li
        :class="['ExpressInfo_precess_item', !item.stepFinish && 'ExpressInfo_precess_item-finish']"
        v-for="(item, idx) in precessList"
        :key="idx"
      >
        <div
          :class="[
            'ExpressInfo_precess_item_circle',
            !item.stepFinish && 'ExpressInfo_precess_item_circle-finish',
          ]"
        >
          <div class="ExpressInfo_precess_item_circle_inner"></div>
        </div>
        <p
          :style="{
            color: !item.stepFinish && '#1890ff',
          }"
          class="ExpressInfo_precess_item_step"
        >
          {{ item.stepName }}
        </p>
        <div class="ExpressInfo_precess_item_info">
          {{ item.stepLabel }}: {{ item.stepPerson }}
          <span class="ExpressInfo_precess_item_info_time">{{ item.stepTime }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
defineOptions({
  name: 'ExpressInfo',
})
const props = defineProps({
  bloodInfo: {
    type: Object,
    default: () => {
      return {}
    },
  },
})
const precessList = computed(() => {
  return [
    {
      step: 1,
      stepName: '已发血',
      stepTime: '2022-10-10 10:10:10',
      stepLabel: '发血人',
      stepPerson: '郭xx',
      stepFinish: false,
    },
    {
      step: 2,
      stepName: '已装箱',
      stepTime: '2022-10-10 10:10:10',
      stepLabel: '装箱人',
      stepPerson: '陈xx',
      stepFinish: true,
    },
  ]
})
</script>

<style scoped lang="scss">
.ExpressInfo {
  &_header {
    display: flex;
    align-items: center;
    width: 100%;
    &_receive {
      width: 24px;
      height: 24px;
      @include CenterHorVertical();
      border: 1px solid #1890ff;
      border-radius: 50%;
      &_text {
        font-size: 12px;
        font-weight: 400;
        color: #1890ff;
      }
    }
    &_info {
      margin-left: 12px;
      font-size: 14px;
      font-weight: bold;
      color: #323233;
    }
  }
  &_precess {
    width: 100%;
    &_item {
      display: flex;
      align-items: center;
      margin-top: 22px;
      opacity: 0.5;
      &-finish {
        opacity: 1;
      }
      &_circle {
        position: relative;
        z-index: 2;
        &-finish {
          background: #1890ff;
        }
        &-finish::after {
          position: absolute;
          top: 14px;
          z-index: 0;
          width: 0px;
          height: 24px;
          content: '';
          border: 1px solid #1890ff;
        }
        width: 14px;
        height: 14px;
        margin-right: 15px;
        background: #ccc;
        border-radius: 50%;
        @include CenterHorVertical();
        &_inner {
          width: 6px;
          height: 6px;
          background: #ffffff;
          border-radius: 50%;
        }
      }
      &_step {
        margin-right: 15px;
        font-size: 14px;
        font-weight: bold;
        color: #323233;
      }
      &_info {
        font-size: 12px;
        font-weight: 400;
        color: #323233;
        &_time {
          margin-left: 14px;
        }
      }
    }
  }
}
</style>
