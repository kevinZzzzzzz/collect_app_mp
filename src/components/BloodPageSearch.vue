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
        placeholder="请输入交接单号/运输箱号/医院名"
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
    <div class="BloodPageSearch_icon">
      <image class="BloodPageSearch_icon_img" src="@img/taskIcon.png" mode="scaleToFill" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
defineOptions({
  name: 'BloodPageSearch',
})
const emit = defineEmits(['searchKeyword'])
const searchValue = ref('')
const searchKeyword = () => {
  emit('searchKeyword', searchValue.value)
}
</script>

<style scoped lang="scss">
.BloodPageSearch {
  display: grid;
  grid-template-columns: 92% 8%;
  grid-gap: 2%;
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
    width: 24px;
    height: 24px;
    &_img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
