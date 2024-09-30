<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5">
{
  style: {
    navigationStyle: 'default',
    navigationBarTitleText: '',
  },
  needLogin: true,
}
</route>
<template>
  <div class="home">
    <h1 class="home_title">穿越血液服务</h1>
    <ul class="home_list">
      <li
        class="home_list_item"
        @click="goUrl(item.route, item.authId)"
        v-for="(item, idx) in routerList"
        :key="idx"
      >
        <image class="home_list_item_img" :src="item.bgImgUrl" mode="scaleToFill" />
        <p class="home_list_item_text">{{ item.name }}</p>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store'
import PLATFORM from '@/utils/platform'
import { $apiGetRoleList } from '@/service/index/common'

const isDev = import.meta.env.DEV
const imagesUrl = import.meta.env.VITE_SERVER_IMAGEURI

const pathBg1 = `${imagesUrl}pathBg1.png`
const pathBg2 = `${imagesUrl}pathBg2.png`
const pathBg3 = `${imagesUrl}pathBg3.png`
const pathBg4 = `${imagesUrl}pathBg4.png`
const userStore = useUserStore()
defineOptions({
  name: 'Home',
})
let menusRole = userStore.userInfo.menus?.split(',') // 菜单权限
console.log(userStore.userInfo, menusRole, 'userStore0000000')
// 获取屏幕边界到安全区域距离
// const { safeAreaInsets } = uni.getSystemInfoSync()
const routerList = ref([
  {
    name: '血液揽收',
    bgImgUrl: pathBg1,
    route: '/packageA/collect/index',
    authId: '10101',
  },
  {
    name: '血液签收',
    bgImgUrl: pathBg2,
    route: '/packageC/sign/index',
    authId: '10102',
  },
  {
    name: '我的任务',
    bgImgUrl: pathBg3,
    route: '',
    authId: '10103',
  },
  {
    name: '血液交接查询',
    bgImgUrl: pathBg4,
    route: '/packageD/search/index',
    // route: '',
    authId: '10104',
  },
])
onLoad(() => {
  if (!userStore.isLogined) {
    uni.showToast({
      icon: 'none',
      title: '请登录',
    })
    setTimeout(() => {
      uni.navigateTo({
        url: '/pages/login/index',
      })
    }, 1000)
  } else {
    $apiGetRoleList().then((res: any) => {
      const { data } = res
      data.forEach((item) => {
        if (item.id === userStore.userInfo.roleId) {
          item.menus && userStore.setMenu(item.menus)
          menusRole = item.menus?.split(',')
        }
      })
    })
  }
})
const goUrl = (url, id) => {
  if (url) {
    if (!menusRole.includes(id) && !isDev) {
      uni.showToast({
        icon: 'error',
        title: '无权限访问',
      })
      return false
    }
    uni.navigateTo({ url, animationType: 'pop-in', animationDuration: 200 })
  } else {
    uni.showToast({
      icon: 'none',
      title: '暂未开放',
    })
  }
}
</script>

<style scoped lang="scss">
.home {
  padding: 16px;
  &_title {
    font-family: PingFang SC;
    font-size: 24px;
    font-weight: bold;
    color: #323233;
    margin: 12px 0px 40px;
  }
  // &_subTitle {
  //   margin-top: 8px;
  //   margin-bottom: 24px;
  //   font-family: PingFang SC;
  //   font-size: 16px;
  //   font-weight: bold;
  //   color: #323233;
  // }
  &_list {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 16px;
    width: 100%;
    &_item {
      position: relative;
      height: 94px;
      &_img {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
      }
      &_text {
        position: absolute;
        z-index: 2;
        margin: 32px;
        font-family: PingFang SC;
        font-size: 20px;
        font-weight: 800;
        color: #323233;
      }
    }
  }
}
</style>
