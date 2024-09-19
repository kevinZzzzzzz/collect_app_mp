import { defineStore } from 'pinia'
import { ref } from 'vue'

export const globalSettingStore = defineStore({
  id: 'global',

  // 数据持久化
  // persist: {
  //   enabled: true,
  //   strategies: [
  //     {
  //       key: 'globalSetting',
  //       storage: localStorage
  //     }
  //   ]
  // },
  state: () => ({
    pageScroll: false, // 判断是否滚动
  }),
  getters: {},
  actions: {
    changePageScroll(val: boolean) {
      this.pageScroll = val
    },
  },
})
