<template>
  <view>
    <embed :src="pdfUrl" type="application/pdf" width="100%" class="pdf" />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, getCurrentInstance, nextTick } from 'vue'
import { getNavigateOptions } from '@/utils/index'
defineOptions({
  name: 'Protocol',
})
const pdfUrl = ref('')
const protocolName = ref('')

onMounted(() => {
  const options: any = getCurrentInstance()
  protocolName.value = getNavigateOptions(options, 'protocolName')
  uni.setNavigationBarTitle({
    title: protocolName.value,
  })
  pdfUrl.value = `http://192.168.120.178:9000/coldChain/src/static/docs/${protocolName.value}.pdf`
  // `/hybrid/html/web/viewer.html?file=http://192.168.120.178:9000/coldChain/src/static/docs/${protocolName.value}.pdf`
})
</script>

<style scoped lang="scss">
.protocol {
  width: 100%;
}
.pdf-container {
  width: 100%;
  height: 100%;
}
.img-wrapper {
  width: 222px;
  height: 80px;
  display: none;
  background: rgba(230, 54, 51, 0.2);
  .sign-picture {
    width: 222px;
    height: 80px;
  }
}
.pdf {
  height: 100vh;
}
</style>
