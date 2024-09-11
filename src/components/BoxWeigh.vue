<template>
  <div class="BoxWeigh">
    <div class="BoxWeigh_item" v-for="(item, idx) in props.weighBoxList" :key="idx">
      <image class="BoxWeigh_item_img" src="@img/boxIcon.png" mode="scaleToFill" />
      <p class="BoxWeigh_item_text">{{ item.bloodId }}</p>
      <div class="BoxWeigh_item_ipt">
        <wd-input type="number" no-border v-model="value" placeholder="请输入" />
      </div>
      <p class="BoxWeigh_item_text">KG</p>
    </div>
    <div class="BoxWeigh_btn">
      <p class="BoxWeigh_btn_text">确认</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
defineOptions({
  name: 'BoxWeigh',
})
const emit = defineEmits(['closeActionSheet'])
const props = defineProps({
  weighBoxList: {
    type: Array,
    default: () => {
      return []
    },
  },
})
const value = ref('')
</script>

<style scoped lang="scss">
.BoxWeigh {
  padding: 0 16px 16px;
  &_item {
    display: grid;
    grid-template-columns: 0.2fr 1fr 1.6fr 0.2fr;
    grid-gap: 10px;
    align-items: center;
    padding: 12px 16px;
    &_img {
      width: 20px;
      height: 22px;
    }
  }
  &_btn {
    width: 100%;
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
}
</style>
