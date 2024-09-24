<template>
  <page-meta :page-style="'overflow:' + (pageScroll && isMp ? 'hidden' : 'visible')"></page-meta>
  <div class="CollectDetail">
    <div class="CollectDetail_header">
      <MapComp :bloodInfo="orderDetail" />
    </div>
    <div class="CollectDetail_detail">
      <div class="CollectDetail_detail_block">
        <BloodInfo :bloodInfo="orderDetail" />
      </div>

      <div class="CollectDetail_detail_block">
        <ExpressInfo :tranStatus="tranStatus" :bloodInfo="orderDetail" />
      </div>

      <div class="CollectDetail_detail_block">
        <BoxList
          :bloodInfo="orderDetail"
          noEditWeight
          showTempAndTime
          @tempBox="openTempBox($event)"
        />
      </div>
    </div>
    <div class="CollectDetail_bottom" :style="{ zIndex: pageScroll ? 0 : 3 }">
      <div class="CollectDetail_bottom_ctx" v-if="+tranStatus === 1">
        <div class="CollectDetail_bottom_ctx_left" @click="signPartOpen()">
          <p class="CollectDetail_bottom_ctx_left_text">部分签收</p>
        </div>
        <div class="CollectDetail_bottom_ctx_right" @click="signAll()">
          <p class="CollectDetail_bottom_ctx_right_text">全部签收</p>
        </div>
      </div>
      <div class="CollectDetail_bottom_ctx1" v-else>
        <div class="CollectDetail_bottom_ctx1_btn" @click="backHome">
          <p class="CollectDetail_bottom_ctx1_btn_text">返回首页</p>
        </div>
      </div>
    </div>
  </div>
  <!-- 部分签收 -->
  <wd-popup v-model="partSignBox" position="bottom" @close="closePartSignBox">
    <div class="partSignBox">
      <div class="partSignBox_header">
        <p class="partSignBox_header_title">部分签收</p>
        <h6 class="partSignBox_header_cancel" @click="closePartSignBox">取消</h6>
      </div>
      <div class="partSignBox_content">
        <div class="partSignBox_content_boxItem" v-for="(item, idx) in partSignList" :key="idx">
          <!-- 运输编号单组件 -->
          <div class="partSignBox_content_boxItem_header">
            <image
              class="partSignBox_content_boxItem_header_img"
              src="@img/uavUnSel.png"
              mode="scaleToFill"
            />
            <div class="partSignBox_content_boxItem_header_text">粤B XY008</div>
          </div>
          <BoxListInfo noEditWeight :boxItem="item" />
          <div class="partSignBox_content_btm">
            <div
              class="partSignBox_content_btm_btn partSignBox_content_btm_btn-left"
              @click="openTempBox"
            >
              温度曲线
            </div>
            <div
              class="partSignBox_content_btm_btn partSignBox_content_btm_btn-right"
              @click="signPart(item)"
            >
              确认签收
            </div>
          </div>
        </div>
      </div>
    </div>
  </wd-popup>
  <wd-popup v-model="showTempBox" position="bottom" @close="closeTempBox">
    <BoxTemp
      v-if="showTempBox"
      lock-scroll
      :safe-area-inset-bottom="true"
      :tempBoxList="tempBoxList"
      @closeTempBox="closeTempBox"
    />
  </wd-popup>

  <wd-message-box></wd-message-box>
</template>

<script setup lang="ts">
import { onMounted, ref, getCurrentInstance, computed } from 'vue'
import MapComp from '@/components/MapComp.vue'
import BoxListInfo from './components/BoxListInfo.vue'
import BloodInfo from './components/BloodInfo.vue'
import ExpressInfo from './components/ExpressInfo.vue'
import BoxList from './components/BoxList.vue'
import { getNavigateOptions } from '@/utils/index'
import { globalSettingStore } from '@/store/global'
import { storeToRefs } from 'pinia'
import { $apiAddTransOrder, $apiGetCollectItemDetail } from '@/service/index/collect'
import { isMp } from '@/utils/platform'
import BoxTemp from './components/BoxTemp.vue'
import { transStatusMap } from '@/constant'
import { useMessage } from 'wot-design-uni'
const message = useMessage()

defineOptions({
  name: 'CollectDetail',
})
const store = globalSettingStore() // 全局设置
const { pageScroll } = storeToRefs(store)
const outboundOrderNo = ref({}) // 交接单号
const orderDetail = ref<any>({}) // 交接单详情
const tranStatus = ref(null) // 交接单状态
const partSignBox = ref(false) // 部分签收弹窗
const partSignList = ref([]) // 部分签收数据

const showTempBox = ref(false) // 打开温度弹窗
const tempBoxList = ref([]) // 温度曲线数据

/**
 * 打开部分签收弹窗
 */
const signPartOpen = () => {
  partSignBox.value = true
  partSignList.value = orderDetail.value.eventNoPackageArr
}
/**
 * 全部签收
 */
const signAll = () => {
  message
    .confirm({
      msg: `是否确定签收交接单${orderDetail.value.outboundOrderNo}`,
      title: '确定签收',
    })
    .then(() => {
      console.log('点击了确定按钮')
      signSuccess()
    })
    .catch(() => {
      console.log('点击了取消按钮')
    })
}
/**
 * 部分签收
 */
const closePartSignBox = () => {
  partSignBox.value = false
}
/**
 * 部分签收-确定
 */
const signPart = (obj) => {
  console.log(obj, '123123')
  message
    .confirm({
      msg: `是否确定签收交接单${orderDetail.value.outboundOrderNo}的${obj.code}号箱子`,
      title: '确定签收',
    })
    .then(() => {
      console.log('点击了确定按钮')
      signSuccess()
    })
    .catch(() => {
      console.log('点击了取消按钮')
    })
}
/**
 * 打开温度弹窗
 */
const openTempBox = (obj?: any) => {
  // tempBoxList.value = props.orderItem.bloodPackages || []
  showTempBox.value = true // 打开温度曲线弹窗
  store.changePageScroll(true)
}
/**
 * 关闭温度弹窗
 */
const closeTempBox = () => {
  showTempBox.value = false
  tempBoxList.value = []
  store.changePageScroll(false)
}
/**
 * 签收完成
 */
const signSuccess = () => {
  uni.navigateTo({
    url: `/packageC/sign/result?outboundOrderNo=${orderDetail.value.outboundOrderNo}`,
  })
}
/**
 * 返回首页
 */
const backHome = () => {
  uni.navigateTo({ url: '/' })
}
onMounted(() => {
  const options: any = getCurrentInstance()
  outboundOrderNo.value = getNavigateOptions(options, 'outboundOrderNo')
  tranStatus.value = getNavigateOptions(options, 'tranStatus') || ''
  const showWeight = getNavigateOptions(options, 'showWeight')
  uni.setNavigationBarTitle({
    title: transStatusMap[tranStatus.value].text,
  })
  $apiGetCollectItemDetail({
    outboundOrderNo: outboundOrderNo.value,
  }).then((res: any) => {
    const { data } = res
    if (data) {
      const arr: any = []
      if (data.eventNoPackageMap) {
        Object.keys(data.eventNoPackageMap).forEach((item: any, idx) => {
          data.eventNoPackageMap[item].forEach((d) => {
            arr.push({
              ...d,
              eventNo: item,
            })
          })
        })
      }
      data.eventNoPackageArr = arr // 箱子信息列表
    }
    orderDetail.value = data
    // console.log(orderDetail.value, 'orderDetail0000000')
    if (+showWeight) {
      showWeighBox.value = true
      weighBoxInfo.value = [orderDetail.value.eventNoPackageArr[0]] || []
    }
  })
})

const showWeighBox = ref(false) // 展示称重弹窗
const weighBoxInfo = ref([]) // 称重数据
/**
 * 打开称重弹窗
 */
const weighBox = (data) => {
  weighBoxInfo.value = (data && [data]) || []
  showWeighBox.value = true // 打开称重弹窗
  store.changePageScroll(true)
}
/**
 * 关闭称重弹窗，并且支持保存更新数据
 */
const closeWeighBox = (data) => {
  showWeighBox.value = false
  weighBoxInfo.value = []
  store.changePageScroll(false)

  if (data) {
    const temp = orderDetail.value.eventNoPackageArr
    temp.forEach((e, idx) => {
      data.forEach((d) => {
        if (d.code == e.code) {
          orderDetail.value.eventNoPackageArr[idx] = d
        }
      })
    })
    // console.log(orderDetail.value.eventNoPackageArr, 'orderDetail.value00000')
  }
}
/**
 * 确定签收
 */
const sureCollect = () => {
  if (notCollect.value) return
  console.log(orderDetail.value)
  // let weightMap = {}
  // orderDetail.value.eventNoPackageArr.forEach((e) => {
  //   weightMap[e.code] = e.weight
  // })
  let params = {
    outboundOrderNo: orderDetail.value.outboundOrderNo,
    OrderType: 2,
    transportPackages: [],
  }
  orderDetail.value.eventNoPackageArr.forEach((e) => {
    let obj = {
      packageRelationNo: e.code,
      weight: e.weight,
      cargoList: [],
    }
    if (e.bloodBagGroupMap) {
      Object.values(e.bloodBagGroupMap).forEach((item: Array<any>) => {
        item.forEach((ele) => {
          obj.cargoList.push({
            cargoType: 1,
            cargoRelationNo: ele.bloodBagId,
          })
        })
      })
    }
    params.transportPackages.push(obj)
  })
  $apiAddTransOrder(params).then((res: any) => {
    console.log(res, 'res')
    // uni.navigateTo({
    //   url: `/packageA/collect/result?outboundOrderNo=${orderDetail.value.outboundOrderNo}&weightMap=${JSON.stringify(weightMap)}`,
    // })
  })
}
/**
 * 跳转到异常页面
 */
const gotoError = () => {
  uni.navigateTo({
    url: '/packageA/collect/error',
  })
}
// 是否可签收
const notCollect = computed(() => {
  return (
    orderDetail.value?.eventNoPackageArr &&
    orderDetail.value?.eventNoPackageArr.some((e) => !e.weight)
  )
})
</script>

<style scoped lang="scss">
page {
  background: #f7f8fa;
}
.CollectDetail {
  position: relative;
  width: 100%;
  &_header {
    position: absolute;
    top: 0;
    z-index: 1;
    width: 100%;
    height: 142px;
  }
  &_detail {
    position: absolute;
    top: 114px;
    z-index: 2;
    width: 100%;
    padding: 0px 16px 60px;
    &_block {
      padding: 8px 12px 10px;
      margin-bottom: 16px;
      background: #ffffff;
      border-radius: 4px 4px 4px 4px;
      box-shadow: 0px 2px 12px 1px rgba(100, 101, 102, 0.12);
    }
  }
  &_bottom {
    position: fixed;
    bottom: 0px;
    width: 100%;
    &_ctx {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 16px;
      padding: 10px 16px;
      background: #fff;
      &_left {
        height: 40px;
        @include CenterHorVertical();
        background: #fff;
        border-radius: 4px 4px 4px 4px;
        border: 1px solid #1890ff;
        &_text {
          font-size: 16px;
          font-weight: 400;
          color: #1890ff;
        }
      }
      &_left:active {
        opacity: 0.8;
      }
      &_right {
        height: 40px;
        @include CenterHorVertical();
        background: #1890ff;
        border-radius: 4px 4px 4px 4px;
        &_text {
          font-size: 16px;
          font-weight: 400;
          color: #ffffff;
        }
      }
      &_right:active {
        opacity: 0.8;
      }
    }
    &_ctx1 {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr;
      padding: 10px 16px;
      background: #fff;
      &_btn {
        height: 40px;
        @include CenterHorVertical();
        background: #1890ff;
        border-radius: 4px 4px 4px 4px;
        &_text {
          font-size: 16px;
          font-weight: 400;
          color: #ffffff;
        }
      }
      &_btn:active {
        opacity: 0.8;
      }
    }
  }
}
.partSignBox {
  padding: 0 16px 16px;
  &_header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 13px 0 13px 10px;
    &_title {
      font-weight: bold;
      font-size: 17px;
      color: #323233;
      position: relative;
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
    &_cancel {
      font-weight: 400;
      font-size: 14px;
      color: #1890ff;
    }
  }
  &_content {
    &_boxItem {
      padding: 10px 12px 12px;
      background: #ffffff;
      box-shadow: 0px 2px 12px 1px rgba(100, 101, 102, 0.12);
      border-radius: 4px 4px 4px 4px;
      margin-bottom: 16px;
      &_header {
        margin: -10px -12px 6px;
        width: calc(100% + 24px);
        height: 32px;
        background: #eef7ff;
        border-radius: 4px 4px 0px 0px;
        padding: 2px 10px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        &_img {
          width: 12px;
          height: 12px;
        }
        &_text {
          margin-left: 3px;
          font-weight: 400;
          font-size: 12px;
          color: #1890ff;
        }
      }
    }
    &_btm {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 27px;
      &_btn {
        font-size: 14px;
        padding: 3px 0px;
        border-radius: 4px;
        border: 1px solid #1890ff;
        @include CenterHorVertical();
        &-left {
          color: #1890ff;
        }
        &-right {
          color: #ffffff;
          background: #1890ff;
        }
      }
      &_btn:active {
        opacity: 0.8;
      }
    }
  }
}
</style>
