<route lang="json5">
{
  style: {
    navigationBarTitleText: '消息通知',
  },
}
</route>
<template>
  <div class="Notified">12332</div>
</template>

<script setup lang="ts">
import { on } from 'events'
import { getCurrentInstance, onMounted, ref } from 'vue'
import { getNavigateOptions } from '@/utils/index'
defineOptions({
  name: 'Notified',
})
const notifiedTypeTabsMap = {
  揽收: ['全部', '待揽收通知', '告警提醒'],
  签收: ['全部', '待签收通知', '告警提醒'],
  交接: ['全部', '已揽收通知', '已签收通知', '告警提醒'],
}
const tabs = ref([]) // 标签页列表
onMounted(() => {
  const options: any = getCurrentInstance()
  const notifiedType: string = getNavigateOptions(options, 'notifiedType') || '揽收'
  tabs.value = notifiedTypeTabsMap[notifiedType]
})
</script>

<style scoped lang="scss">
.Notified {
  width: 100%;
}
</style>
