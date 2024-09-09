<route lang="json5">
{
  style: {
    navigationBarTitleText: '血液揽收',
  },
}
</route>
<template>
  <div class="collect pageCenter">
    <BloodPageSearch />
    <DateSelect />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BloodPageSearch from '@/components/BloodPageSearch.vue'
import DateSelect from '@/components/DateSelect.vue'
defineOptions({
  name: 'collect',
})
</script>

<style scoped lang="scss">
.collect {
  padding: 0 16px;
  overflow-y: scroll;
}
</style>
