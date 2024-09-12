<template>
  <div class="BoxList">
    <div class="BoxList_header">
      <p class="BoxList_header_title">揽件信息</p>
      <p class="BoxList_header_right">{{ boxAmount }}箱</p>
    </div>
    <!-- <ul class="BoxList_list">
      <li class="BoxItem" v-for="(item, idx) in bloodBagList" :key="idx">
        <p class="BoxItem_header">运单号: {{ item.handoverId }}</p>
        <div class="BoxItem_main">
          <div class="BoxItem_main_ctx">
            <div class="BoxItem_main_ctx_col">
              <image class="BoxItem_main_ctx_col_img" src="@img/boxIcon.png" mode="scaleToFill" />
              <div class="BoxItem_main_ctx_col_info">
                <div class="BoxItem_main_ctx_col_info_id">{{ item.bloodId }}</div>
                <div class="BoxItem_main_ctx_col_info_detail">
                  <span class="BoxItem_main_ctx_col_info_detail_num">86%</span>
                  <image
                    class="BoxItem_main_ctx_col_info_detail_img"
                    src="@img/electricIcon.png"
                    mode="scaleToFill"
                  />
                  <image
                    class="BoxItem_main_ctx_col_info_detail_img"
                    src="@img/wifiIcon.png"
                    mode="scaleToFill"
                  />
                </div>
              </div>
            </div>
            <div class="BoxItem_main_ctx_col-2line">
              <p class="BoxItem_main_ctx_col_num">16</p>
              <p class="BoxItem_main_ctx_col_type">{{ item.bloodType }}</p>
            </div>
            <div class="BoxItem_main_ctx_col-2line">
              <p class="BoxItem_main_ctx_col_num">-2°C</p>
              <p class="BoxItem_main_ctx_col_type">温度</p>
            </div>
          </div>
          <div class="BoxItem_main_btn">
            <div class="orderBtn BoxItem_main_btn_left">温度曲线</div>
            <div class="orderBtn BoxItem_main_btn_right" @click="weighBox">称重</div>
          </div>
          <div class="BoxItem_main_time">更新时间：2024-08-20 12:00</div>
        </div>
      </li>
    </ul> -->
    <OrderItem :orderItem="bloodInfo">
      <template v-slot:time>
        <div class="BoxList_list_time">发血时间：2024-08-20 12:00</div>
      </template>
      <template v-slot:btm>
        <div class="BoxList_list_btm">
          <div class="BoxList_list_btm_btn">
            <div class="orderBtn BoxList_list_btm_btn_left">温度曲线</div>
            <div class="orderBtn BoxList_list_btm_btn_right" @click="weighBox()">称重</div>
          </div>
        </div>
      </template>
    </OrderItem>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import OrderItem from '@/components/OrderItem.vue'
defineOptions({
  name: 'BoxList',
})
const props = defineProps({
  bloodInfo: {
    type: Object,
    default: () => {
      return {}
    },
  },
})
const showActionSheet = ref(false)
const emit = defineEmits(['weighBox'])
const boxAmount = computed(() => {
  return (props.bloodInfo.bloodPackages && props.bloodInfo.bloodPackages.length) || 0
})
const bloodPackages = computed(() => {
  return props.bloodInfo.bloodPackages || []
})
const handleClose = () => {
  emit('weighBox')
}
const weighBox = () => {
  emit('weighBox', props.bloodInfo)
}
</script>

<style scoped lang="scss">
.BoxList {
  &_header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 10px;
    &_title {
      position: relative;
      margin-left: 9px;
      font-size: 17px;
      font-weight: bold;
      color: #323233;
    }
    &_title::before {
      position: absolute;
      top: 5px;
      left: -9px;
      width: 3px;
      height: 14px;
      content: '';
      background: #1890ff;
      border-radius: 5px 5px 5px 5px;
    }
  }
  &_list {
    display: grid;
    grid-auto-columns: 1fr;
    grid-gap: 16px;
    width: 100%;
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
// .BoxItem {
//   width: 100%;
//   &_header {
//     padding: 3px 12px;
//     font-size: 12px;
//     font-weight: 400;
//     color: #323233;
//     background: #eef7ff;
//     border-radius: 4px 4px 0px 0px;
//   }
//   &_main {
//     width: 100%;
//     background: #ffffff;
//     border-radius: 0px 0px 4px 4px;
//     box-shadow: 0px 2px 12px 1px rgba(126, 128, 129, 0.12);
//     &_ctx {
//       display: grid;
//       grid-template-columns: 1fr 0.6fr 0.6fr;
//       padding: 13px 9px;
//       &_col {
//         display: flex;
//         align-items: center;
//         &_img {
//           width: 22px;
//           height: 25px;
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
//           font-size: 14px;
//           color: #1890ff;
//         }
//         &_type {
//           font-size: 14px;
//           color: #323233;
//         }
//       }
//     }
//     &_btn {
//       display: grid;
//       grid-template-columns: 1fr 1fr;
//       grid-gap: 20px;
//       width: 100%;
//       padding: 0 16px;
//       font-size: 14px;
//       font-weight: 400;
//       &_left {
//         color: #1890ff;
//         background: #ffffff;
//         border: 1px solid #1890ff;
//         border-radius: 4px;
//       }
//       &_right {
//         color: #ffffff;
//         background: #1890ff;
//         border-radius: 4px;
//       }
//     }
//     &_time {
//       width: 100%;
//       margin-top: 3px;
//       font-size: 12px;
//       font-weight: 400;
//       color: #999393;
//       @include CenterHorVertical();
//     }
//   }
// }
.orderBtn {
  width: 100%;
  height: 30px;
  // background: #ffffff;
  @include CenterHorVertical();
}
</style>
