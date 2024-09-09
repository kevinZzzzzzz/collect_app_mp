<template>
  <div class="DateSelect">
    <wd-calendar use-default-slot type="daterange" v-model="value" allow-same-day>
      <div class="DateSelect_block">
        <div class="DateSelect_block_item">
          <div class="DateSelect_block_item_left">
            <p class="DateSelect_block_item_left_text1">开始时间</p>
            <h3 class="DateSelect_block_item_left_text2">2024年8月29日</h3>
          </div>
          <wd-icon name="swap-right" size="22px" color="#323233"></wd-icon>
        </div>
        <div class="DateSelect_block_item">
          <div class="DateSelect_block_item_left">
            <p class="DateSelect_block_item_left_text1">结束时间</p>
            <h3 class="DateSelect_block_item_left_text2">2024年8月30日</h3>
          </div>
          <wd-icon name="chevron-right" size="22px" color="#323233"></wd-icon>
        </div>
      </div>
    </wd-calendar>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { dayjs } from '@/uni_modules/wot-design-uni'
defineOptions({
  name: 'DateSelect',
})
const value = ref<string>('')
</script>

<style scoped lang="scss">
.DateSelect {
  width: 100%;
  &_block {
    display: grid;
    grid-template-columns: 1fr 0.8fr;
    width: 100%;
    &_item {
      display: flex;
      justify-content: space-evenly;
      &_left {
        display: flex;
        flex-direction: column;
        &_text1 {
          font-family: PingFang SC;
          font-size: 12px;
          font-weight: 400;
          color: #848485;
        }
        &_text2 {
          font-family: PingFang SC;
          font-size: 16px;
          font-weight: bold;
          color: #323233;
        }
      }
    }
  }
}
</style>
