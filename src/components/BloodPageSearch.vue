<template>
  <div class="BloodPageSearch">
    <div class="BloodPageSearch_iptBox">
      <wd-input
        clearable
        use-prefix-slot
        use-suffix-slot
        no-border
        v-model="searchValue"
        size="midium"
        placeholder="请输入交接单号/医院名"
      >
        <template #prefix>
          <wd-icon name="search" color="#1890ff" size="14px"></wd-icon>
        </template>
        <template #suffix>
          <wd-button custom-class="btn" size="small" hairline @click="searchKeyword">
            查询
          </wd-button>
        </template>
      </wd-input>
    </div>
    <div class="BloodPageSearch_icon" v-if="rightBtnType">
      <image
        :style="{ width: '24px', height: '24px' }"
        v-if="rightBtnType === 'person'"
        class="BloodPageSearch_icon_img"
        :src="taskIcon"
        mode="scaleToFill"
        @click="gotoUrl('person')"
      />
      <image
        :style="{ width: '30px', height: '30px' }"
        v-if="rightBtnType === 'history'"
        class="BloodPageSearch_icon_img"
        :src="historyRecordIcon"
        mode="scaleToFill"
        @click="gotoUrl('history')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import taskIcon from '@img/taskIcon.png'
import historyRecordIcon from '@img/historyRecordIcon.png'
defineOptions({
  name: 'BloodPageSearch',
})
const emit = defineEmits(['searchKeyword'])
const props = defineProps({
  rightBtnType: {
    type: String,
    default: '',
  },
})
const searchValue = ref('')
const searchKeyword = () => {
  emit('searchKeyword', searchValue.value)
}
const gotoUrl = (type) => {
  if (type === 'history') {
    uni.navigateTo({
      url: '/packageD/historyStatistic/index',
    })
  }
}
</script>

<style scoped lang="scss">
.BloodPageSearch {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 0;
  &_iptBox {
    width: 100%;
    padding: 4px 8px;
    background-color: #fff;
    border: 1px solid #1890ff;
    border-radius: 4px 4px 4px 4px;
  }
  &_icon {
    margin-left: 8px;
    &_img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
