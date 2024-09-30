<route lang="json5">
{
  style: {
    navigationBarTitleText: '历史统计',
  },
  needLogin: true,
}
</route>
<template>
  <div class="HistoryStatistic">历史统计</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
defineOptions({
  name: 'HistoryStatistic',
})
</script>

<style scoped lang="scss">
.HistoryStatistic {
}
</style>
