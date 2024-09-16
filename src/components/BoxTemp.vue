<template>
  <div class="BoxTemp">
    <div class="BoxTemp_header">
      <p class="BoxTemp_header_title">温度曲线</p>
      <h6 class="BoxTemp_header_cancel" @click="closeTemp()">取消</h6>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
defineOptions({
  name: 'BoxTemp',
})
const emit = defineEmits(['closeTempBox'])

const closeTemp = () => {
  emit('closeTempBox')
}
</script>

<style scoped lang="scss">
.BoxTemp {
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
}
</style>
