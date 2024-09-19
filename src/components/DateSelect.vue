<template>
  <div class="DateSelect">
    <wd-calendar
      use-default-slot
      type="daterange"
      v-model="dateVal"
      allow-same-day
      :formatter="formatter"
      @confirm="handleConfirm"
    >
      <div class="DateSelect_block">
        <div class="DateSelect_block_item">
          <div class="DateSelect_block_item_left">
            <!-- <p class="DateSelect_block_item_left_text1">开始时间</p> -->
            <h3 class="DateSelect_block_item_left_text2">{{ dateValFormat[0] }}</h3>
          </div>
          <wd-icon name="swap-right" size="22px" color="#C6C6C7"></wd-icon>
        </div>
        <div class="DateSelect_block_item">
          <div class="DateSelect_block_item_left">
            <!-- <p class="DateSelect_block_item_left_text1">结束时间</p> -->
            <h3 class="DateSelect_block_item_left_text2">{{ dateValFormat[1] }}</h3>
          </div>
          <wd-icon name="chevron-right" size="22px" color="#C6C6C7"></wd-icon>
        </div>
      </div>
    </wd-calendar>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { dayjs } from 'wot-design-uni'
defineOptions({
  name: 'DateSelect',
})
const emit = defineEmits(['searchByTime'])
const dataFormat = 'YYYY年MM月DD日'
const dataFormat1 = 'YYYY-MM-DD'
const dateVal = ref<any>([new Date().getTime(), new Date().getTime()])
const dateValFormat = ref<any>([
  dayjs(new Date().getTime()).format(dataFormat),
  dayjs(new Date().getTime()).format(dataFormat),
])
/**
 * 格式化日期
 * @param day
 */
const formatter = (day) => {
  const date = new Date(day.date)
  const now = new Date()
  const year = date.getFullYear()
  const month = date.getMonth()
  const da = date.getDate()
  const nowYear = now.getFullYear()
  const nowMonth = now.getMonth()
  const nowDa = now.getDate()

  if (year === nowYear && month === nowMonth && da === nowDa) {
    day.topInfo = '今天'
  }

  if (day.type === 'start') {
    day.bottomInfo = '开始'
  }

  if (day.type === 'end') {
    day.bottomInfo = '结束'
  }

  return day
}
const handleConfirm = ({ value }) => {
  dateValFormat.value[0] = dayjs(value[0]).format(dataFormat)
  dateValFormat.value[1] = dayjs(value[1]).format(dataFormat)

  emit('searchByTime', {
    startTime: dayjs(value[0]).format(dataFormat1),
    endTime: dayjs(value[1]).format(dataFormat1),
  })
}
</script>

<style scoped lang="scss">
.DateSelect {
  width: 100%;
  margin-bottom: 5px;
  &_block {
    display: grid;
    grid-template-columns: 1fr 0.8fr;
    width: 100%;
    &_item {
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      &_left {
        display: flex;
        flex-direction: column;
        &_text1 {
          font-family: PingFang SC;
          font-size: 12px;
          font-weight: 400;
          color: #848485;
        }
        &_text2 {
          font-family: PingFang SC;
          font-weight: 400;
          font-size: 14px;
          color: #989898;
        }
      }
    }
  }
}
</style>
