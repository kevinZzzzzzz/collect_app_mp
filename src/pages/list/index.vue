<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5">
{
  style: {
    navigationStyle: 'custom',
  },
}
</route>
<template>
  <view class="bg-white overflow-hidde" :style="{ marginTop: safeAreaInsets?.top + 'px' }">
    <wd-navbar title="">
      <template #left>
        <div class="header">123</div>
      </template>
    </wd-navbar>
    234324d
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
defineOptions({
  name: 'List',
})
const { safeAreaInsets } = uni.getSystemInfoSync()
</script>

<style scoped lang="scss">
.header {
  width: 100%;
  height: 100%;
  background-color: red;
}
</style>
