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
        @click="goUrl(item.route)"
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
import pathBg1 from '@/static/images/pathBg1.png'
import pathBg2 from '@/static/images/pathBg2.png'
import pathBg3 from '@/static/images/pathBg3.png'
import pathBg4 from '@/static/images/pathBg4.png'
const userStore = useUserStore()
defineOptions({
  name: 'Home',
})

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
const routerList = ref([
  {
    name: '血液揽收',
    bgImgUrl: pathBg1,
    route: '/packageA/collect/index',
  },
  {
    name: '血液签收',
    bgImgUrl: pathBg2,
    route: '/packageC/sign/index',
  },
  {
    name: '我的任务',
    bgImgUrl: pathBg3,
    route: '',
  },
  {
    name: '血液交接查询',
    bgImgUrl: pathBg4,
    route: '',
  },
])
const isMp = ref(PLATFORM.isMp)
// 测试 uni API 自动引入
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
  }
})
const goUrl = (url) => {
  url && uni.navigateTo({ url, animationType: 'pop-in', animationDuration: 200 })
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
        margin: -16px;
        width: calc(100% + 32px);
        height: calc(94px + 32px);
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
