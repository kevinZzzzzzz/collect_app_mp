import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    const userInfo = ref<any>({})
    const userToken = ref(null)

    const setUserInfo = (val: any) => {
      userInfo.value = val
    }
    const setUserToken = (val: any) => {
      userToken.value = val
    }
    // 刷新菜单
    const setMenu = (val: any) => {
      userInfo.value.menus = val
    }
    const clearUserInfo = () => {
      userToken.value = null
      userInfo.value = {}
    }
    // 一般没有reset需求，不需要的可以删除
    const reset = () => {
      userInfo.value = {}
      userToken.value = null
    }
    const isLogined = computed(() => !!userToken.value)

    return {
      userInfo,
      userToken,
      setUserInfo,
      setUserToken,
      clearUserInfo,
      isLogined,
      reset,
      setMenu
    }
  },
  {
    persist: true,
  },
)
