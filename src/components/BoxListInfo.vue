<template>
  <div class="BoxListInfo">
    <div class="BoxListInfo_header">
      <image class="BoxListInfo_header_img" src="@img/transBoxIcon.png" mode="scaleToFill" />
      <div class="BoxListInfo_header_info">
        <div class="BoxListInfo_header_info_id">{{ boxItem.code }}</div>
        <div class="BoxListInfo_header_info_detail">
          <span class="BoxListInfo_header_info_detail_num">86%</span>
          <image
            class="BoxListInfo_header_info_detail_img"
            src="@img/electricIcon.png"
            mode="scaleToFill"
          />
          <image
            class="BoxListInfo_header_info_detail_img"
            src="@img/wifiIcon.png"
            mode="scaleToFill"
          />
        </div>
      </div>
      <div
        v-show="boxItem.weight && needHandleWeightBtn"
        class="BoxListInfo_header_editWeight"
        @click="setWeight(boxItem)"
      >
        <p class="BoxListInfo_header_editWeight_text">{{ boxItem.weight }}KG</p>
        <image
          class="BoxListInfo_header_editWeight_img"
          src="@img/editIcon.png"
          mode="scaleToFill"
        />
      </div>
    </div>
    <ul class="BoxListInfo_list">
      <li
        :class="['BoxListInfo_list_item', item.weight && 'BoxListInfo_list_item-4col']"
        v-for="(item, idx) in bloodBagGroupList"
        :key="item.id"
      >
        <div class="BoxListInfo_list_item_col">
          <div class="BoxListInfo_list_item_col_name">
            <p class="BoxListInfo_list_item_col_name_text">
              {{ idx + 1 }}
            </p>
          </div>
        </div>
        <div class="BoxListInfo_list_item_col-2line">
          <p class="BoxListInfo_list_item_col_num">{{ item.capacity }}</p>
          <p class="BoxListInfo_list_item_col_type">{{ item.bloodType }}</p>
        </div>
        <div class="BoxListInfo_list_item_col-2line">
          <p class="BoxListInfo_list_item_col_num">{{ tempData }}</p>
          <p class="BoxListInfo_list_item_col_type">温度</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
defineOptions({
  name: 'BoxListInfo', // 箱子信息组件
})
const props = defineProps({
  boxItem: {
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
})
const emit = defineEmits(['setWeight'])
const bloodBagGroupList = computed(() => {
  const arr = []
  if (props.boxItem.bloodBagGroupMap) {
    Object.values(props.boxItem.bloodBagGroupMap).forEach((item: Array<any>) => {
      arr.push(...item)
    })
  }
  return arr
})
const tempData = computed(() => {
  let tempL = null
  let tempR = null
  if (
    props?.boxItem.deviceStremDataMap.temp &&
    Array.isArray(props?.boxItem.deviceStremDataMap.temp)
  ) {
    tempL = props?.boxItem.deviceStremDataMap.temp[0]
    tempR = props?.boxItem.deviceStremDataMap.temp[1]
  }
  return tempL && tempR ? `${tempL}~${tempR}°C` : tempL ? `${tempL}°C` : tempR ? `${tempR}°C` : ''
})

// 单个称重
const setWeight = (data) => {
  emit('setWeight', data)
}
</script>

<style scoped lang="scss">
.BoxListInfo {
  width: 100%;
  &_header {
    width: 100%;
    display: grid;
    grid-template-columns: 27px 1fr 0.1fr;
    align-items: center;
    justify-content: space-between;
    &_img {
      width: 27px;
      height: 27px;
      margin-right: 6px;
    }
    &_info {
      display: flex;
      align-items: center;
      &_id {
        font-size: 14px;
        font-weight: bold;
        color: #323233;
        margin: 0 3px;
      }
      &_detail {
        display: flex;
        align-items: center;
        &_num {
          font-size: 12px;
          color: #848485;
          margin: 0 3px;
        }
        &_img {
          width: 12px;
          height: 7px;
          margin: 0 3px;
        }
      }
    }
    &_editWeight {
      display: flex;
      &_text {
        font-weight: bold;
        font-size: 14px;
        color: #323233;
      }
      &_img {
        width: 20px;
        height: 20px;
      }
    }
  }
  &_list {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 16px;
    &_item {
      display: grid;
      grid-template-columns: 0.5fr 1fr 1fr;
      &-4col {
        grid-template-columns: 0.5fr 1fr 1fr 1fr;
      }
      &_col {
        display: flex;
        align-items: center;
        &_name {
          width: 38px;
          height: 22px;
          background: #eef7ff;
          border-radius: 4px 4px 4px 4px;
          border: 1px solid #1890ff;
          @include CenterHorVertical();
          &_text {
            font-size: 12px;
            color: #1890ff;
          }
        }
        &_info {
          &_id {
            font-size: 14px;
            font-weight: bold;
            color: #323233;
          }
          &_detail {
            display: flex;
            align-items: center;
            &_num {
              font-size: 12px;
              color: #848485;
            }
            &_img {
              width: 12px;
              height: 7px;
              margin: 0 3px;
            }
          }
        }
        &-2line {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        &_num {
          font-weight: 600;
          font-size: 14px;
          color: #1890ff;
        }
        &_type {
          font-size: 14px;
          color: #323233;
        }
      }
    }
  }
}
</style>
