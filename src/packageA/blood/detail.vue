<template>
  <div class="CollectDetail">
    <div class="CollectDetail_header">
      <MapComp />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MapComp from '@/components/MapComp.vue'
defineOptions({
  name: 'CollectDetail',
})
</script>

<style scoped lang="scss">
.CollectDetail {
  width: 100%;
  &_header {
    width: 100%;
    height: 142px;
    background-color: red;
  }
}
</style>
