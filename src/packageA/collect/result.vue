<template>
  <div class="CollectResult">
    <div class="CollectResult_header">
      <image class="CollectResult_header_img" src="@img/succResultIcon.png" mode="scaleToFill" />
      <p class="CollectResult_header_text">揽收成功</p>
    </div>
    <div class="CollectResult_block">
      <div class="CollectResult_block_item">
        <div class="CollectResult_block_item_left">交接单号:</div>
        <div class="CollectResult_block_item_right">{{ orderDetail.outboundOrderNo }}</div>
      </div>
      <div class="CollectResult_block_item">
        <div class="CollectResult_block_item_left">配送方式:</div>
        <div class="CollectResult_block_item_right">无人机配送</div>
      </div>
    </div>
    <div class="CollectResult_block">
      <div class="CollectResult_block_item">
        <div class="CollectResult_block_item_left">发送方:</div>
        <div class="CollectResult_block_item_right">{{ orderDetail.outboundApplicant }}</div>
      </div>
      <div class="CollectResult_block_item">
        <div class="CollectResult_block_item_left">接收方:</div>
        <div class="CollectResult_block_item_right">{{ orderDetail.outboundReceiver }}</div>
      </div>
    </div>
    <div class="CollectResult_block">
      <BoxList :bloodInfo="orderDetail" />
    </div>
    <div class="CollectResult_btm">
      <div class="CollectResult_btm_item CollectResult_btm_item-left">
        <div class="CollectResult_btm_item_text CollectResult_btm_item_text-left">返回首页</div>
      </div>
      <div class="CollectResult_btm_item CollectResult_btm_item-right">
        <div class="CollectResult_btm_item_text CollectResult_btm_item_text-right">开始启运</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BoxList from './components/BoxList.vue'

defineOptions({
  name: 'CollectResult',
})
const orderDetail = ref<any>({}) // 交接单详情

onMounted(() => {
  import('./detail.json').then(({ default: res }) => {
    const { data } = res
    orderDetail.value = data
  })
})
</script>

<style scoped lang="scss">
page {
  background: #f7f8fa;
}
.CollectResult {
  padding: 32px 16px 0;
  position: relative;
  &_header {
    @include CenterHorVertical();
    flex-direction: column;
    &_img {
      width: 80px;
      height: 80px;
      margin-bottom: 10px;
    }
    &_text {
      font-family: PingFang SC;
      font-weight: bold;
      font-size: 17px;
      color: #323233;
    }
  }
  &_block {
    width: 100%;
    margin-top: 16px;
    background: #ffffff;
    box-shadow: 0px 2px 12px 1px rgba(100, 101, 102, 0.12);
    border-radius: 4px 4px 4px 4px;
    padding: 16px;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 16px;
    &_item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      &_left {
        font-weight: bold;
        font-size: 14px;
        color: #323233;
      }
      &_right {
        font-weight: bold;
        font-size: 14px;
        color: #323233;
      }
    }
  }
  &_btm {
    width: 100%;
    padding: 10px 16px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
    background: #fff;
    position: fixed;
    bottom: 0px;
    left: 0;
    &_item {
      width: 100%;
      padding: 8px 0 10px;
      border-radius: 4px 4px 4px 4px;
      @include CenterHorVertical();
      &-left {
        border: 1px solid #1890ff;
      }
      &-right {
        border: 1px solid #1890ff;
        background: #1890ff;
      }
      &_text {
        font-family: PingFang SC;
        font-size: 14px;
        font-weight: 400;
        text-align: center;
        &-left {
          color: #1890ff;
        }
        &-right {
          color: #fff;
        }
      }
    }
  }
}
</style>
