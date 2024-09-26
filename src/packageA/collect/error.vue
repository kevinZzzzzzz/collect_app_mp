<route lang="json5">
{
  style: {
    navigationBarTitleText: '揽收异常',
  },
}
</route>
<template>
  <div class="CollectError">
    <div class="CollectError_block">
      <div class="CollectError_block_header">
        <p class="CollectError_block_header_text">登记信息</p>
      </div>
      <div class="CollectError_block_item">
        <div class="CollectError_block_item_left">发送方:</div>
        <div class="CollectError_block_item_right">{{ orderDetail.outboundApplicant }}</div>
      </div>
      <div class="CollectError_block_item">
        <div class="CollectError_block_item_left">接收方:</div>
        <div class="CollectError_block_item_right">{{ orderDetail.outboundReceiver }}</div>
      </div>
    </div>
    <div class="CollectError_block">
      <div class="CollectError_block_item">
        <div class="CollectError_block_item_left">交接单号:</div>
        <div class="CollectError_block_item_right">{{ orderDetail.outboundOrderNo }}</div>
      </div>
      <div class="CollectError_block_item">
        <div class="CollectError_block_item_left">配送方式:</div>
        <div class="CollectError_block_item_right">无人机配送</div>
      </div>
    </div>
    <div class="CollectError_block">
      <div class="CollectError_block_header">
        <p class="CollectError_block_header_text">揽件信息</p>
        <p class="CollectError_block_header_num">{{ orderDetail.eventNoPackageArr.length }}箱</p>
      </div>
      <div class="CollectError_block_main">
        <div
          class="CollectError_block_main_box"
          v-for="item in orderDetail.eventNoPackageArr"
          :key="item.code"
        >
          <image
            class="CollectError_block_main_box_img"
            src="@img/transBoxIcon.png"
            mode="scaleToFill"
          />
          <p class="CollectError_block_main_box_text">
            {{ item.code }}
          </p>
        </div>
      </div>
    </div>
    <div class="CollectError_block">
      <div class="CollectError_block_header">
        <p class="CollectError_block_header_text">选择揽收异常类型</p>
      </div>
      <div class="CollectError_block_list">
        <wd-radio-group v-model="errorTypeVal.value" shape="dot" @change="changeRadio">
          <wd-radio :value="item.value" v-for="(item, idx) in errorTypeList" :key="idx">
            {{ item.label }}
          </wd-radio>
        </wd-radio-group>
        <wd-input
          style="margin-top: 8px"
          no-border
          v-model="errorTypeVal.text"
          :disabled="errorTypeVal.value !== 4"
        />
      </div>
    </div>
    <div class="CollectError_btm">
      <div class="CollectError_btm_item">
        <div class="CollectError_btm_item_text" @click="confirmError(true)">确定标示为揽收异常</div>
      </div>
    </div>
  </div>
  <wd-popup
    v-model="errorConfirm"
    position="center"
    custom-style="border-radius: 10px"
    @close="confirmError(false)"
  >
    <div class="errorConfigBox">
      <div class="errorConfigBox_title">揽收异常</div>
      <div class="errorConfigBox_msg">确认是否揽收异常</div>
      <div class="errorConfigBox_btm">
        <div
          class="errorConfigBox_btm_item errorConfigBox_btm_item-cancel"
          @click="confirmError(false)"
        >
          取消
        </div>
        <div
          class="errorConfigBox_btm_item errorConfigBox_btm_item-sure"
          @click="confirmError(false, true)"
        >
          确定
        </div>
      </div>
    </div>
  </wd-popup>
</template>

<script setup lang="ts">
import { transStatusTextMap } from '@/constant'
import { $apiGetCollectItemDetail, $apiTransOrderException } from '@/service/index/collect'
import { getNavigateOptions } from '@/utils'
import { ref } from 'vue'
defineOptions({
  name: 'CollectError',
})
const errorTypeList = [
  {
    label: '货物损坏',
    value: 1,
  },
  {
    label: '临时不能飞，已自行完成配送',
    value: 2,
  },
  {
    label: '血站无法按照订单内容提供运输物品',
    value: 3,
  },
  {
    label: '其他',
    value: 4,
  },
]
const orderDetail = ref<any>({}) // 交接单详情
const errorTypeVal = ref({
  value: 1,
  text: '',
}) // 异常类型
const errorConfirm = ref(false) // 异常确认()
const outboundOrderNo = ref({}) // 交接单号
const tranStatus = ref(null) // 交接单状态

/**
 * 选择异常
 * @param e
 */
const changeRadio = (e) => {
  if (e.value !== 4) {
    errorTypeVal.value.text = ''
  }
}
/**
 * 确定异常
 * @param flag 打开、关闭
 * @param isSubmit 是否提交
 */
const confirmError = (flag, isSubmit?: boolean) => {
  errorConfirm.value = flag
  // if (isSubmit) {
  //   const params = {
  //     transportOrderNo: orderDetail.value.transportOrderNo
  //   }
  //   $apiTransOrderException
  // }
}
onMounted(() => {
  const options: any = getCurrentInstance()
  outboundOrderNo.value = getNavigateOptions(options, 'outboundOrderNo')
  tranStatus.value = getNavigateOptions(options, 'tranStatus') || ''

  $apiGetCollectItemDetail({
    outboundOrderNo: outboundOrderNo.value,
    outboundStatus: tranStatus.value,
  }).then((res: any) => {
    const { data } = res
    if (data) {
      const arr = []
      if (data.eventNoPackageMap) {
        Object.keys(data.eventNoPackageMap).forEach((item, idx) => {
          data.eventNoPackageMap[item].forEach((d) => {
            arr.push({
              weight: null,
              eventNo: item,
              ...d,
            })
          })
        })
      }
      data.eventNoPackageArr = arr // 箱子信息列表
    }
    orderDetail.value = data
  })
})
</script>

<style scoped lang="scss">
page {
  background: #f7f8fa;
}
.CollectError {
  padding: 6px 16px 60px;
  position: relative;
  &_block {
    width: 100%;
    margin-bottom: 16px;
    background: #ffffff;
    box-shadow: 0px 2px 12px 1px rgba(100, 101, 102, 0.12);
    border-radius: 4px 4px 4px 4px;
    padding: 9px 16px;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 16px;
    &_header {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &_text {
        font-weight: bold;
        font-size: 17px;
        color: #323233;
        position: relative;
      }
      &_text::before {
        position: absolute;
        top: 5px;
        left: -9px;
        width: 3px;
        height: 14px;
        content: '';
        background: #1890ff;
        border-radius: 5px 5px 5px 5px;
      }
      &_num {
        font-weight: 400;
        font-size: 14px;
        color: #323233;
      }
    }
    &_item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 9px 0;
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
    &_main {
      padding: 0px 0px 6px;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      &_box {
        display: flex;
        align-items: center;
        &_img {
          width: 27px;
          height: 27px;
          margin-right: 6px;
        }
        &_text {
          font-weight: bold;
          font-size: 17px;
          color: #323233;
        }
      }
    }
  }
  &_btm {
    width: 100%;
    padding: 10px 30px;
    display: grid;
    grid-template-columns: 1fr;
    background: #fff;
    position: fixed;
    bottom: 0px;
    left: 0;
    &_item {
      width: 100%;
      padding: 8px 86px;
      border-radius: 4px 4px 4px 4px;
      background: #1890ff;
      @include CenterHorVertical();
      &_text {
        font-family: PingFang SC;
        font-size: 16px;
        font-weight: 400;
        text-align: center;
        color: #fff;
      }
    }
  }
}
.errorConfigBox {
  width: 311px;
  &_title {
    text-align: center;
    padding: 16px 0px;
    font-weight: 500;
    font-size: 19px;
    color: #313233;
  }
  &_msg {
    text-align: center;
    margin-bottom: 24px;
    font-weight: 400;
    font-size: 14px;
    color: #959799;
  }
  &_btm {
    border-top: 1px solid #eaedf0;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 10px;
    &_item {
      padding: 13px 0;
      @include CenterHorVertical();
      &-cancel {
        font-weight: 400;
        font-size: 16px;
        color: #313233;
      }
      &-sure {
        font-weight: 400;
        font-size: 16px;
        color: #1890ff;
      }
    }
  }
}
</style>
