<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5">
{
  style: {
    navigationStyle: 'default',
    navigationBarTitleText: '',
  },
}
</route>
<template>
  <div class="home">
    <h1 class="home_title">医院血液服务端</h1>
    <h2 class="home_subTitle">供血运输</h2>
    <ul class="home_list">
      <li
        class="home_list_item"
        v-for="(item, idx) in routerList"
        :key="idx"
        :style="{
          backgroundImage: isMp
            ? `url(/static/images/${item.bgImgUrl}.png)`
            : `url(./static/images/${item.bgImgUrl}.png)`,
        }"
      >
        <p class="home_list_item_text">{{ item.name }}</p>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'Home',
})
import PLATFORM from '@/utils/platform'

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
const routerList = ref([
  {
    name: '血液揽收',
    bgImgUrl: 'pathBg1',
  },
  {
    name: '血液签收',
    bgImgUrl: 'pathBg2',
  },
  {
    name: '我的任务',
    bgImgUrl: 'pathBg3',
  },
  {
    name: '血液交接查询',
    bgImgUrl: 'pathBg4',
  },
])
const isMp = ref(PLATFORM.isMp)
// 测试 uni API 自动引入
onLoad(() => {})
const goUrl = (url) => {
  uni.navigateTo({ url, animationType: 'pop-in', animationDuration: 200 })
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
  }
  &_subTitle {
    margin-top: 8px;
    margin-bottom: 24px;
    font-family: PingFang SC;
    font-size: 16px;
    font-weight: bold;
    color: #323233;
  }
  &_list {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 16px;
    width: 100%;
    &_item {
      position: relative;
      height: 94px;
      &_text {
        margin: 32px;
        font-family: PingFang SC;
        font-size: 20px;
        font-weight: 800;
        color: #323233;
      }
      background-repeat: no-repeat;
      background-position: left center;
      background-size: 100%;
      border-radius: 8px 8px 8px 8px;
    }
  }
}
</style>
