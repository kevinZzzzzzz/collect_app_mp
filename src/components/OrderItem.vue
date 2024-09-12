<template>
  <div class="OrderItem">
    <!-- <div class="OrderItem_tips">
      <wd-icon name="warning" size="10px" color="#4bbba1"></wd-icon>
      <p class="OrderItem_tips_text">长时间未揽收，请及时处理</p>
    </div> -->
    <div class="OrderItem_header">
      <div class="OrderItem_header_left">
        交接单号: {{ orderItem.outboundOrderNo }}
        <wd-tag custom-class="space" type="danger">紧急</wd-tag>
      </div>
      <div class="OrderItem_header_right">{{ tabsList[tabSel] }}</div>
    </div>
    <div class="OrderItem_main">
      <!-- <ul class="OrderItem_main_list" v-if="!orderItem.bloodId">
        <li
          v-for="(item, idx) in orderItem.bloodBagList"
          :key="idx"
          :class="['OrderItem_main_list_item', item.weight && 'OrderItem_main_list_item-4col']"
        >
          <div class="OrderItem_main_list_item_col">
            <image
              class="OrderItem_main_list_item_col_img"
              src="@img/boxIcon.png"
              mode="scaleToFill"
            />
            <div class="OrderItem_main_list_item_col_info">
              <div class="OrderItem_main_list_item_col_info_id">{{ item.bloodId }}</div>
              <div class="OrderItem_main_list_item_col_info_detail">
                <span class="OrderItem_main_list_item_col_info_detail_num">86%</span>
                <image
                  class="OrderItem_main_list_item_col_info_detail_img"
                  src="@img/electricIcon.png"
                  mode="scaleToFill"
                />
                <image
                  class="OrderItem_main_list_item_col_info_detail_img"
                  src="@img/wifiIcon.png"
                  mode="scaleToFill"
                />
              </div>
            </div>
          </div>
          <div class="OrderItem_main_list_item_col-2line">
            <p class="OrderItem_main_list_item_col_num">16</p>
            <p class="OrderItem_main_list_item_col_type">{{ item.bloodType }}</p>
          </div>
          <div class="OrderItem_main_list_item_col-2line">
            <p class="OrderItem_main_list_item_col_num">-2°C</p>
            <p class="OrderItem_main_list_item_col_type">温度</p>
          </div>
          <div class="OrderItem_main_list_item_col-2line" v-if="item.weight">
            <p class="OrderItem_main_list_item_col_num">{{ item.weight }}</p>
            <p class="OrderItem_main_list_item_col_type">重量</p>
          </div>
        </li>
      </ul> -->
      <!-- <div class="OrderItem_main_multiList">
        <div class="OrderItem_main_multiList_header">
          <image
            class="OrderItem_main_multiList_header_img"
            src="@img/boxIcon.png"
            mode="scaleToFill"
          />
          <div class="OrderItem_main_multiList_header_info">
            <div class="OrderItem_main_multiList_header_info_id">{{ orderItem.bloodId }}</div>
            <div class="OrderItem_main_multiList_header_info_detail">
              <span class="OrderItem_main_multiList_header_info_detail_num">86%</span>
              <image
                class="OrderItem_main_multiList_header_info_detail_img"
                src="@img/electricIcon.png"
                mode="scaleToFill"
              />
              <image
                class="OrderItem_main_multiList_header_info_detail_img"
                src="@img/wifiIcon.png"
                mode="scaleToFill"
              />
            </div>
          </div>
        </div>
        <ul class="OrderItem_main_multiList_list">
          <li
            v-for="(item, idx) in orderItem.bloodBagList"
            :key="idx"
            :class="[
              'OrderItem_main_multiList_list_item',
              item.weight && 'OrderItem_main_multiList_list_item-4col',
            ]"
          >
            <div class="OrderItem_main_multiList_list_item_col">
              <div class="OrderItem_main_multiList_list_item_col_name">
                <p class="OrderItem_main_multiList_list_item_col_name_text">
                  {{ `血液${idx + 1}` }}
                </p>
              </div>
            </div>
            <div class="OrderItem_main_multiList_list_item_col-2line">
              <p class="OrderItem_main_multiList_list_item_col_num">16</p>
              <p class="OrderItem_main_multiList_list_item_col_type">{{ item.bloodType }}</p>
            </div>
            <div class="OrderItem_main_multiList_list_item_col-2line">
              <p class="OrderItem_main_multiList_list_item_col_num">-2~0°C</p>
              <p class="OrderItem_main_multiList_list_item_col_type">温度</p>
            </div>
            <div class="OrderItem_main_multiList_list_item_col-2line" v-if="item.weight">
              <p class="OrderItem_main_multiList_list_item_col_num">{{ item.weight }}KG</p>
              <p class="OrderItem_main_multiList_list_item_col_type">重量</p>
            </div>
          </li>
        </ul>
      </div> -->
      <div class="OrderItem_main_boxItem" v-for="(item, idx) in orderItem.bloodPackages" :key="idx">
        <BoxListInfo :boxItem="item" />
        <!-- <div class="OrderItem_main_boxItem_time">发血时间：2024-08-20 12:00</div>

        <div class="OrderItem_main_boxItem_btm">
          <div class="OrderItem_main_boxItem_btm_btn">
            <div class="orderBtn OrderItem_main_boxItem_btm_btn_left">温度曲线</div>
            <div class="orderBtn OrderItem_main_boxItem_btm_btn_right">称重</div>
          </div>
        </div> -->
      </div>
      <slot name="time"></slot>
      <slot name="btm"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BoxListInfo from '@/components/BoxListInfo.vue'
defineOptions({
  name: 'OrderItem',
})
const props = defineProps({
  orderItem: {
    type: Object,
    default: () => {
      return {}
    },
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
