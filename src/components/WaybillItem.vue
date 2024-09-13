<template>
  <div class="OrderItem">
    <!-- <div class="OrderItem_tips">
      <wd-icon name="warning" size="10px" color="#4bbba1"></wd-icon>
      <p class="OrderItem_tips_text">长时间未揽收，请及时处理</p>
    </div> -->
    <div class="OrderItem_header">
      <div class="OrderItem_header_left">
        交接单号: {{ props.orderItem.outboundOrderNo }}
        <wd-tag custom-class="space" type="danger">紧急</wd-tag>
      </div>
      <div class="OrderItem_header_right">{{ tabsList[tabSel] }}</div>
    </div>
    <div class="OrderItem_main">
      <div
        class="OrderItem_main_boxItem"
        v-for="(item, idx) in props.orderItem.bloodPackages"
        :key="idx"
      >
        <!-- 箱子信息组件 -->
        <BoxListInfo
          :needHandleWeightBtn="needHandleWeightBtn"
          :boxItem="item"
          @setWeight="setSignalWeigh($event)"
        />
      </div>
      <div
        class="OrderItem_main_boxItem_btm"
        v-if="!needHandleWeightBtn || (needHandleWeightBtn && !isReportWeight)"
      >
        <div class="OrderItem_main_boxItem_btm_btn">
          <div class="orderBtn OrderItem_main_boxItem_btm_btn_left">温度曲线</div>
          <div
            class="orderBtn OrderItem_main_boxItem_btm_btn_right"
            @click.stop="setWeigh(props.orderItem)"
          >
            称重
          </div>
        </div>
      </div>
      <div>
        <slot name="time"></slot>
      </div>
    </div>
  </div>
  <teleport to="body">
    <wd-popup v-model="showWeighBox" position="bottom" @close="closeWeighBox">
      <BoxWeigh :weighBoxList="weighBoxList" @closeWeighBox="closeWeighBox" />
    </wd-popup>
  </teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BoxListInfo from '@/components/BoxListInfo.vue'
import BoxWeigh from '@/components/BoxWeigh.vue'
defineOptions({
  name: 'OrderItem', // 运输单组件
})
const props = defineProps({
  orderItem: {
    type: Object,
    default: () => {
      return {}
    },
  },
  // 是否需要处理称重按钮
  needHandleWeightBtn: {
    type: Boolean,
    default: false,
  },
  tabsList: {
    type: Object,
    default: () => {
      return []
    },
  },
  tabSel: {
    type: Number,
    default: 0,
  },
})
// 该交接单是否已经上报过重量
const isReportWeight = computed(() => {
  return props.orderItem?.bloodPackages?.some((d) => d.weight)
})
const showWeighBox = ref(false) // 展示称重弹窗
const weighBoxList = ref([]) // 称重数据

// 处理单个称重
const setSignalWeigh = (signalData) => {
  setWeigh({
    bloodPackages: [signalData],
  })
}
// 称重
const setWeigh = (data) => {
  weighBoxList.value = data.bloodPackages || []
  showWeighBox.value = true // 打开称重弹窗
}
// 关闭称重弹窗
const closeWeighBox = () => {
  showWeighBox.value = false
  weighBoxList.value = []
}
</script>

<style scoped lang="scss">
.OrderItem {
  width: 100%;
  margin-bottom: 12px;
  &_tips {
    display: flex;
    align-items: center;
    &_text {
      margin-left: 3px;
      font-size: 10px;
      color: #4bbba1;
    }
  }
  &_header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    background: #eef7ff;
    border-radius: 4px 4px 0px 0px;
    &_left {
      font-size: 14px;
      font-weight: bold;
      color: #323233;
    }
    &_right {
      font-weight: bold;
      color: #4bbba1;
    }
  }
  // &_main {
  //   padding: 10px 12px 6px;
  //   &_list {
  //     display: grid;
  //     grid-template-columns: 1fr;
  //     grid-gap: 16px;
  //     &_item {
  //       display: grid;
  //       grid-template-columns: 1fr 0.6fr 0.6fr;
  //       &-4col {
  //         grid-template-columns: 1fr 0.6fr 0.6fr 0.6fr;
  //       }
  //       &_col {
  //         display: flex;
  //         align-items: center;
  //         &_img {
  //           width: 27px;
  //           height: 27px;
  //           margin-right: 6px;
  //         }
  //         &_info {
  //           &_id {
  //             font-size: 14px;
  //             font-weight: bold;
  //             color: #323233;
  //           }
  //           &_detail {
  //             display: flex;
  //             align-items: center;
  //             &_num {
  //               font-size: 12px;
  //               color: #848485;
  //             }
  //             &_img {
  //               width: 12px;
  //               height: 7px;
  //               margin: 0 3px;
  //             }
  //           }
  //         }
  //         &-2line {
  //           display: flex;
  //           flex-direction: column;
  //           align-items: center;
  //           justify-content: center;
  //         }
  //         &_num {
  //           font-weight: 600;
  //           font-size: 14px;
  //           color: #1890ff;
  //         }
  //         &_type {
  //           font-size: 14px;
  //           color: #323233;
  //         }
  //       }
  //     }
  //   }
  //   &_multiList {
  //     width: 100%;
  //     &_header {
  //       display: flex;
  //       align-items: center;
  //       &_img {
  //         width: 27px;
  //         height: 27px;
  //         margin-right: 6px;
  //       }
  //       &_info {
  //         display: flex;
  //         align-items: center;
  //         &_id {
  //           font-size: 14px;
  //           font-weight: bold;
  //           color: #323233;
  //           margin: 0 3px;
  //         }
  //         &_detail {
  //           display: flex;
  //           align-items: center;
  //           &_num {
  //             font-size: 12px;
  //             color: #848485;
  //             margin: 0 3px;
  //           }
  //           &_img {
  //             width: 12px;
  //             height: 7px;
  //             margin: 0 3px;
  //           }
  //         }
  //       }
  //     }
  //     &_list {
  //       display: grid;
  //       grid-template-columns: 1fr;
  //       grid-gap: 16px;
  //       &_item {
  //         display: grid;
  //         grid-template-columns: 0.5fr 1fr 1fr;
  //         &-4col {
  //           grid-template-columns: 0.5fr 1fr 1fr 1fr;
  //         }
  //         &_col {
  //           display: flex;
  //           align-items: center;
  //           &_name {
  //             width: 38px;
  //             height: 22px;
  //             background: #ffffff;
  //             border-radius: 4px 4px 4px 4px;
  //             border: 1px solid #cdcdcd;
  //             @include CenterHorVertical();
  //             &_text {
  //               font-size: 10px;
  //               color: #cdcdcd;
  //             }
  //           }
  //           &_info {
  //             &_id {
  //               font-size: 14px;
  //               font-weight: bold;
  //               color: #323233;
  //             }
  //             &_detail {
  //               display: flex;
  //               align-items: center;
  //               &_num {
  //                 font-size: 12px;
  //                 color: #848485;
  //               }
  //               &_img {
  //                 width: 12px;
  //                 height: 7px;
  //                 margin: 0 3px;
  //               }
  //             }
  //           }
  //           &-2line {
  //             display: flex;
  //             flex-direction: column;
  //             align-items: center;
  //             justify-content: center;
  //           }
  //           &_num {
  //             font-weight: 600;
  //             font-size: 14px;
  //             color: #1890ff;
  //           }
  //           &_type {
  //             font-size: 14px;
  //             color: #323233;
  //           }
  //         }
  //       }
  //     }
  //   }
  // }
  &_main {
    padding: 10px 12px 6px;

    &_boxItem {
      width: 100%;
      margin-bottom: 10px;
      &_time {
        width: 100%;
        margin-top: 3px;
        font-size: 12px;
        font-weight: 400;
        color: #999393;
        text-align: left;
      }
      &_btm {
        width: 100%;
        margin-top: 9px;

        &_btn {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-gap: 26px;
          font-size: 14px;
          font-weight: 400;
          &_left {
            color: #1890ff;
            background: #ffffff;
            border: 1px solid #1890ff;
            border-radius: 4px;
          }
          &_right {
            color: #ffffff;
            background: #1890ff;
            border-radius: 4px;
          }
        }
      }
    }
  }
}
.orderBtn {
  width: 129px;
  height: 30px;
  // background: #ffffff;
  @include CenterHorVertical();
}
</style>
