<template>
  <div class="BoxListInfo">
    <div class="BoxListInfo_header">
      <div class="BoxListInfo_header_img">
        <image class="BoxListInfo_header_img_ctx" src="@img/transBoxIcon.png" mode="scaleToFill" />
        <div class="BoxListInfo_header_img_icon">
          <img src="@img/arriveIcon.png" alt="" v-if="boxItemRef.packageStatus === '04'" />
          <img src="@img/signIcon.png" alt="" v-else-if="boxItemRef.packageStatus === '06'" />
        </div>
      </div>
      <div class="BoxListInfo_header_info">
        <div class="BoxListInfo_header_info_id">{{ boxItemRef.code }}</div>
        <div class="BoxListInfo_header_info_detail">
          <span class="BoxListInfo_header_info_detail_num">
            {{ boxItemRef.energy ? boxItemRef.energy + '%' : '--%' }}
          </span>
          <image
            v-if="boxItemRef.energy >= 90"
            class="BoxListInfo_header_info_detail_img"
            src="@img/powerH.png"
            mode="scaleToFill"
          />
          <image
            v-else-if="boxItemRef.energy < 90 && boxItemRef.energy > 20"
            class="BoxListInfo_header_info_detail_img"
            src="@img/powerM.png"
            mode="scaleToFill"
          />
          <image
            v-else
            class="BoxListInfo_header_info_detail_img"
            src="@img/powerL.png"
            mode="scaleToFill"
          />
          <image
            v-if="boxItemRef.signal && boxItemRef.signal >= -35"
            class="BoxListInfo_header_info_detail_img"
            src="@img/wifiH.png"
            mode="scaleToFill"
          />
          <image
            v-if="!boxItemRef.signal || boxItemRef.signal < -90"
            class="BoxListInfo_header_info_detail_img"
            src="@img/wifiL.png"
            mode="scaleToFill"
          />
          <image
            v-else-if="boxItemRef.signal && boxItemRef.signal < -35 && boxItemRef.signal >= -90"
            class="BoxListInfo_header_info_detail_img"
            src="@img/wifiM.png"
            mode="scaleToFill"
          />
        </div>
      </div>
      <div
        v-if="boxItemRef.weight"
        class="BoxListInfo_header_editWeight"
        @click="setWeight(boxItemRef)"
      >
        <p class="BoxListInfo_header_editWeight_text">{{ boxItemRef.weight }}KG</p>
        <image
          v-if="!noEditWeight"
          class="BoxListInfo_header_editWeight_img"
          src="@img/editIcon.png"
          mode="scaleToFill"
        />
      </div>
    </div>
    <ul class="BoxListInfo_list">
      <li class="BoxListInfo_list_item" v-for="(item, idx) in bloodBagGroupList" :key="item.id">
        <div class="BoxListInfo_list_item_col">
          <div class="BoxListInfo_list_item_col_name">
            <p class="BoxListInfo_list_item_col_name_text">
              {{ idx + 1 }}
            </p>
          </div>
        </div>
        <div class="BoxListInfo_list_item_col-2line">
          <p class="BoxListInfo_list_item_col_num">{{ item.conversion || '--' }}U</p>
          <p class="BoxListInfo_list_item_col_type">{{ item.bloodType }}</p>
        </div>
        <div class="BoxListInfo_list_item_col-2line">
          <p class="BoxListInfo_list_item_col_num">{{ tempData }}</p>
          <p class="BoxListInfo_list_item_col_type">温度</p>
        </div>
      </li>
    </ul>
    <div class="BoxListInfo_time">
      <p class="BoxListInfo_time_text">更新时间: {{ boxItemRef.updateTime }}</p>
      <div v-if="showTempAndTime" class="BoxListInfo_time_btn" @click="setTemps(boxItemRef)">
        温度曲线
      </div>
    </div>
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
  noEditWeight: {
    // 是否禁止编辑重量
    type: Boolean,
    default: false,
  },
  showTempAndTime: {
    // 展示温度曲线在时间同行
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['setWeight', 'setTemps'])

const boxItemRef = ref<any>(props.boxItem)
watch(
  () => props.boxItem,
  (n) => {
    boxItemRef.value = n
  },
)
const bloodBagGroupList = computed(() => {
  const arr = []
  if (boxItemRef.value.bloodBagGroupMap) {
    Object.values(boxItemRef.value.bloodBagGroupMap).forEach((item: Array<any>) => {
      if (item.length > 1) {
        const obj = {
          bloodType: '',
          conversion: null,
        }
        item.forEach((d) => {
          d.bloodType && (obj.bloodType = d.bloodType)
          d.conversion && (obj.conversion += Number(d.conversion))
        })
        // const tempArr = item?.reduce((prev, next) => {
        //   return {
        //     ...next,
        //     conversion: prev?.conversion ? prev.conversion + next.conversion : next.conversion,
        //   }
        // }, [])
        arr.push(obj)
      } else {
        arr.push({
          bloodType: item[0].bloodType,
          conversion: item[0].conversion,
        })
      }
    })
  }
  return arr
})
const tempData = computed(() => {
  let tempL = null
  let tempR = null
  if (
    boxItemRef.value.deviceStremDataMap?.temp &&
    Array.isArray(boxItemRef.value.deviceStremDataMap?.temp)
  ) {
    tempL = boxItemRef.value.deviceStremDataMap?.temp[0]
    tempR = boxItemRef.value.deviceStremDataMap?.temp[1]
  }
  return tempL && tempR ? `${tempL}~${tempR}°C` : tempL ? `${tempL}°C` : tempR ? `${tempR}°C` : '--'
})

// 单个称重
const setWeight = (data) => {
  if (props.noEditWeight) return false
  emit('setWeight', data)
}
// 单个温度显示
const setTemps = (data) => {
  emit('setTemps', data)
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
      position: relative;
      &_ctx {
        width: 100%;
        height: 100%;
      }
      &_icon {
        width: 16px;
        height: 16px;
        position: absolute;
        right: 0;
        bottom: 0;
      }
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
          width: 14px;
          height: 8px;
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
      grid-template-columns: 0.4fr 1fr 1fr;
      &_col {
        display: flex;
        align-items: center;
        &_name {
          // width: 38px;
          // height: 22px;
          padding: 3px 12px;
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
  &_time {
    width: 100%;
    margin: 5px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &_text {
      font-weight: 400;
      font-size: 12px;
      color: #999393;
    }
    &_btn {
      padding: 5px 22px;
      font-weight: 400;
      font-size: 12px;
      color: #1890ff;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #1890ff;
    }
  }
}
</style>
