<template>
  <wd-config-provider :themeVars="themeVars">
    <slot />
    <wd-toast />
    <wd-message-box />
    <wd-popup />
  </wd-config-provider>
</template>

<script lang="ts" setup>
import type { ConfigProviderThemeVars } from 'wot-design-uni'

const themeVars: ConfigProviderThemeVars = {
  // colorTheme: 'red',
  buttonPrimaryBgColor: '#1890FF',
  buttonPrimaryColor: '#fff',
  calendarActiveColor: '#1890FF',
  radioDotCheckedBg: '#1890FF',
}
</script>

<style lang="scss">
// .content {
//   padding: 16px;
// }
</style>
