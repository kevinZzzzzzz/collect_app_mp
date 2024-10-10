<template>
  <div class="ExpressInfo">
    <div class="ExpressInfo_header">
      <div class="ExpressInfo_header_receive">
        <p class="ExpressInfo_header_receive_text">收</p>
      </div>
      <div class="ExpressInfo_header_info">
        <div class="ExpressInfo_header_info_line">
          <p class="ExpressInfo_header_info_line_name" v-if="bloodInfo.consigneePerson">
            {{ bloodInfo.consigneePerson || '--' }}
          </p>
          <p class="ExpressInfo_header_info_line_tel" v-if="bloodInfo.consigneeTelephone">
            {{ bloodInfo.consigneeTelephone || '--' }}
          </p>
        </div>
        <div class="ExpressInfo_header_info_line" v-if="bloodInfo.consigneeAddress">
          <p class="ExpressInfo_header_info_line_addr">{{ bloodInfo.consigneeAddress || '--' }}</p>
        </div>
      </div>
    </div>
    <ul class="ExpressInfo_precess">
      <li
        :class="['ExpressInfo_precess_item', !item.index && 'ExpressInfo_precess_item-first']"
        v-for="item in precessList"
        :key="item.index"
      >
        <div
          :class="[
            'ExpressInfo_precess_item_circle',
            !item.index && 'ExpressInfo_precess_item_circle-first',
            +bloodInfo.transportStatus === 7 &&
              !item.index &&
              'ExpressInfo_precess_item_circle-firstError',
            precessList.length &&
              item.index == precessList.length - 1 &&
              'ExpressInfo_precess_item_circle-last',
          ]"
        >
          <div class="ExpressInfo_precess_item_circle_inner"></div>
        </div>
        <p
          :style="{
            color: !item.index
              ? +bloodInfo.transportStatus === 7
                ? '#EE0A24'
                : '#1890ff'
              : 'none',
          }"
          class="ExpressInfo_precess_item_step"
        >
          {{ item.status }}
        </p>
        <div
          class="ExpressInfo_precess_item_info"
          :style="{
            color: !item.index && +bloodInfo.transportStatus === 7 ? '#EE0A24' : 'none',
          }"
        >
          {{ item.operateType }}: {{ item.operator }}
          <span class="ExpressInfo_precess_item_info_time">{{ item.time }}</span>
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
  const orderOperationRecordVoList = props.bloodInfo.orderOperationRecordVoList?.map((e, idx) => {
    return {
      ...e,
      index: props.bloodInfo.orderOperationRecordVoList.length - 1 - idx,
    }
  })
  return orderOperationRecordVoList?.reverse() || []
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
      &_line {
        display: flex;
        align-items: center;
        &_name {
          font-size: 14px;
          font-weight: bold;
          color: #323233;
          margin-right: 16px;
        }
        &_tel {
          font-weight: 400;
          font-size: 12px;
          color: #323233;
        }
        &_addr {
          font-weight: 400;
          font-size: 12px;
          color: #323233;
        }
      }
    }
  }
  &_precess {
    width: 100%;
    &_item {
      display: flex;
      align-items: center;
      margin-top: 22px;
      opacity: 0.5;
      &-first {
        opacity: 1;
      }
      &_circle {
        position: relative;
        z-index: 2;
        &-first {
          background: #1890ff;
        }
        &-firstError {
          background: #ee0a24;
        }
        &-first::after {
          position: absolute;
          top: 14px;
          z-index: 0;
          width: 0px;
          height: 24px;
          content: '';
          border: 1px solid #1890ff !important;
        }
        &-firstError::after {
          position: absolute;
          top: 14px;
          z-index: 0;
          width: 0px;
          height: 24px;
          content: '';
          border: 1px solid #ee0a24 !important;
        }
        &-last::after {
          position: absolute;
          top: 14px;
          z-index: 0;
          width: 0px;
          height: 24px;
          content: '';
          border: 1px solid transparent !important;
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
      &_circle::after {
        position: absolute;
        top: 14px;
        z-index: 0;
        width: 0px;
        height: 24px;
        content: '';
        border: 1px solid #ccc;
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
