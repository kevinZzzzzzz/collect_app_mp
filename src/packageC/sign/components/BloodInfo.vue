<template>
  <div class="BloodInfo">
    <div class="BloodInfo_header">
      <div class="BloodInfo_header_text">交接单号: {{ bloodInfo.outboundOrderNo }}</div>
      <image
        class="BloodInfo_header_copy"
        src="@img/copyIcon.png"
        mode="scaleToFill"
        @click="copyVal(bloodInfo.outboundOrderNo)"
      />
      <!-- <wd-tag color="#EE0A24" bg-color="#FEE6E8">紧急</wd-tag> -->
      <div
        class="BloodInfo_header_type"
        v-if="bloodInfo.outboundType || bloodInfo.outboundType == 0"
      >
        <image
          class="BloodInfo_header_type_img"
          v-if="bloodInfo.outboundType === 2"
          src="@img/uavUnSel.png"
          mode="scaleToFill"
        />
        <image
          class="BloodInfo_header_type_img"
          v-else
          src="@img/carUnSel.png"
          mode="scaleToFill"
        />
        <p class="BloodInfo_header_type_text">{{ transportWays[bloodInfo.outboundType] }}</p>
      </div>
    </div>
    <div class="BloodInfo_divider"></div>
    <div class="BloodInfo_address">
      <div class="BloodInfo_address_item">
        <p class="BloodInfo_address_item_icon start">始</p>
        <p class="BloodInfo_address_item_addr">{{ bloodInfo.outboundApplicant || '--' }}</p>
      </div>
      <div class="BloodInfo_address_item">
        <p class="BloodInfo_address_item_icon end">终</p>
        <p class="BloodInfo_address_item_addr">{{ bloodInfo.outboundReceiver || '--' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { transportWays } from '@/constant/index'
defineOptions({
  name: 'BloodInfo',
})
const props = defineProps({
  bloodInfo: {
    type: Object,
    default: () => {
      return {}
    },
  },
})
const copyVal = (val) => {
  uni.setClipboardData({
    data: val,
    success: () => {
      uni.showToast({
        title: '复制成功',
        icon: 'none',
        duration: 1000,
      })
    },
  })
}
</script>

<style scoped lang="scss">
.BloodInfo {
  &_header {
    position: relative;
    display: flex;
    align-items: center;
    &_text {
      font-size: 12px;
      font-weight: bold;
      color: #323233;
    }
    &_copy {
      width: 17px;
      height: 17px;
      margin-right: 6px;
    }
    &_type {
      position: absolute;
      top: -8px;
      right: -12px;
      display: flex;
      align-items: center;
      padding: 5px 16px 5px 8px;
      background: rgba(24, 144, 255, 0.1);
      border-radius: 0px 4px 0px 4px;
      &_img {
        width: 13px;
        height: 13px;
        margin-right: 5px;
      }
      &_text {
        font-size: 12px;
        font-weight: 400;
        color: #1890ff;
      }
    }
  }
  &_divider {
    width: 100%;
    height: 1px;
    margin: 6px 0px;
  }
  &_address {
    &_item {
      display: flex;
      align-items: center;
      &_icon {
        width: 14px;
        height: 14px;
        margin-right: 8px;
        font-size: 8px;
        font-weight: 400;
        line-height: 14px;
        color: #f7f8fa;
        text-align: center;
        border-radius: 3px 3px 3px 3px;
      }
      &_addr {
        font-size: 14px;
        font-weight: 400;
        color: #323233;
      }
    }
    &_item:nth-of-type(1) {
      margin-bottom: 11px;
    }
  }
}
.start {
  background: #f6bc46;
}
.end {
  background: #5db1ff;
}
</style>
