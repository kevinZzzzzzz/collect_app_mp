<route lang="json5">
{
  style: {
    navigationBarTitleText: '血液交接查询',
  },
  needLogin: true,
}
</route>
<template>
  <!-- <page-meta :page-style="'overflow:' + (pageScroll && isMp ? 'hidden' : 'visible')"></page-meta> -->
  <div class="search">
    <div class="search_top">
      <BloodPageSearch style="width: 100%" @searchKeyword="searchKeyword($event)" />
    </div>
    <div class="search_block1">
      <div class="search_block1_header">
        <p class="search_block1_header_left">今日交接</p>
        <image
          class="search_block1_header_right"
          src="@img/tadayHandoverIcon.png"
          mode="scaleToFill"
        />
      </div>
      <div class="search_block1_main">
        <div class="search_block1_main_item"></div>
        <div class="search_block1_main_item"></div>
        <div class="search_block1_main_item"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { onMounted, ref } from 'vue'
import { dayjs } from 'wot-design-uni'
import BloodPageSearch from '@/components/BloodPageSearch.vue'
defineOptions({
  name: 'BloodHandover',
})
const searchData = ref([])
const tabs = ['待揽收', '已揽收', '异常']
const tab = ref('待揽收')
const isLoading = ref(false) // 加载中
const keyword = ref('') // 搜索关键字
/**
 * 关键字查询
 * @param {*} data
 */
const searchKeyword = (data) => {
  searchData.value = []
  keyword.value = data
  // getData()
}
</script>

<style scoped lang="scss">
page {
  background: #f7f8fa;
}
.search {
  width: 100%;
  overflow-y: scroll;
  position: relative;
  &_top {
    width: 100%;
    padding: 0 16px;
    background-color: #fff;
  }
  &_block1 {
    width: 100%;
    margin-top: 4px;
    background-color: #fff;
    padding: 7px 16px 10px;
    &_header {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      &_left {
        font-weight: bold;
        font-size: 17px;
        color: #323233;
        margin-left: 9px;
        position: relative;
      }
      &_left::before {
        content: '';
        width: 3px;
        height: 14px;
        background: #1890ff;
        border-radius: 5px 5px 5px 5px;
        position: absolute;
        left: -9px;
        top: 50%;
        transform: translateY(-50%);
      }
      &_right {
        width: 20px;
        height: 23px;
      }
    }
    &_main {
      margin-top: 10px;
      width: 100%;
      display: grid;
      grid-template-columns: 0.6fr 1fr 1fr;
      grid-gap: 9px;
      &_item {
        width: 100%;
      }
    }
  }
}
</style>
