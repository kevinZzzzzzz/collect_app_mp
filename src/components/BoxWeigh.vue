<template>
  <div class="BoxWeigh">
    <div class="BoxWeigh_header">
      <p class="BoxWeigh_header_title">运输箱称重</p>
      <h6 class="BoxWeigh_header_cancel" @click="closeWeigh()">取消</h6>
    </div>
    <div class="BoxWeigh_item" v-for="(item, idx) in props.weighBoxList" :key="idx">
      <image class="BoxWeigh_item_img" src="@img/transBoxIcon.png" mode="scaleToFill" />
      <p class="BoxWeigh_item_text">{{ item.code }}</p>
      <div class="BoxWeigh_item_ipt">
        <wd-input type="number" no-border v-model="item.weight" placeholder="请输入" />
      </div>
      <p class="BoxWeigh_item_text">KG</p>
    </div>
    <div class="BoxWeigh_btn">
      <p class="BoxWeigh_btn_text">确认</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
defineOptions({
  name: 'BoxWeigh',
})
const emit = defineEmits(['closeWeighBox'])
const props = defineProps({
  weighBoxInfo: {
    type: Object,
    default: () => {
      return {}
    },
  },
  weighBoxList: {
    type: Array<any>,
    default: () => {
      return []
    },
  },
})

const closeWeigh = () => {
  emit('closeWeighBox')
}
</script>

<style scoped lang="scss">
.BoxWeigh {
  padding: 0 16px 16px;
  &_header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 13px 0 13px 10px;
    &_title {
      font-weight: bold;
      font-size: 17px;
      color: #323233;
      position: relative;
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
    &_cancel {
      font-weight: 400;
      font-size: 14px;
      color: #1890ff;
    }
  }
  &_item {
    display: grid;
    grid-template-columns: 0.2fr 1fr 1.6fr 0.2fr;
    grid-gap: 10px;
    align-items: center;
    padding: 12px 16px;
    &_text {
      font-weight: bold;
      font-size: 17px;
      color: #323233;
    }
    &_img {
      width: 27px;
      height: 27px;
    }
  }
  &_btn {
    width: 100%;
    height: 40px;
    margin-top: 16px;
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
:deep(.wd-input) {
  background: #eef7ff;
  padding: 1px 0 1px 8px !important;
  border-radius: 4px 4px 4px 4px !important;
}
</style>
