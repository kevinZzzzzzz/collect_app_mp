<route lang="json5">
{
  style: {
    navigationBarTitleText: '登录注册',
  },
}
</route>
<template>
  <div class="identity">
    <h1 class="identity_title">医院血液服务端</h1>
    <div class="identity_form">
      <div class="identity_form_input">
        <wd-input
          center
          clearable
          use-prefix-slot
          no-border
          v-model="identityInfo.telephone"
          size="midium"
          placeholder="请输入您的手机号"
        >
          <template #prefix>
            <image class="inputIcon" src="@img/telIcon.png" mode="scaleToFill" />
          </template>
        </wd-input>
      </div>
      <div class="identity_form_input">
        <wd-input
          center
          clearable
          use-prefix-slot
          no-border
          v-model="identityInfo.username"
          size="midium"
          placeholder="姓名"
        >
          <template #prefix>
            <image class="inputIcon3" src="@img/userIcon.png" mode="scaleToFill" />
          </template>
        </wd-input>
      </div>
      <div class="identity_form_input">
        <wd-picker
          use-label-slot
          align-left
          label-width="auto"
          v-model="identityInfo.identityType"
          :columns="identityTypeList"
          auto-complete
        >
          <template #label>
            <image class="inputIcon2" src="@img/identityIcon.png" mode="scaleToFill" />
          </template>
        </wd-picker>
      </div>
      <div class="identity_form_input">
        <wd-input
          center
          clearable
          use-prefix-slot
          no-border
          v-model="identityInfo.username"
          size="midium"
          placeholder="证件号"
        >
          <template #prefix>
            <image class="inputIcon2" src="@img/identityIcon.png" mode="scaleToFill" />
          </template>
        </wd-input>
      </div>
    </div>
    <div class="identity_form_submit">
      <!-- <wd-button class="identity_form_submit_btn" plain hairline size="midium">确认登录</wd-button> -->
      <span class="identity_form_submit_text">确认登录</span>
    </div>
    <div class="identity_form_tips">
      <wd-checkbox v-model="identityInfo.agreeProtocol"></wd-checkbox>
      <div class="identity_form_tips_text">
        我已阅读并同意
        <wd-button type="text">《用户协议》</wd-button>
        与
        <wd-button type="text">《隐私政策》</wd-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
defineOptions({
  name: 'Identity',
})
const identityInfo = ref({
  telephone: '',
  username: '',
  identityType: [],
  identityNo: '',
  agreeProtocol: false,
})
const identityTypeList = ref(['选项1', '选项2', '选项3', '选项4', '选项5', '选项6', '选项7'])
</script>

<style scoped lang="scss">
.identity {
  padding: 54px 16px 0;
  &_title {
    margin-bottom: 30px;
    font-family: PingFang SC;
    font-size: 24px;
    font-weight: bold;
    color: #323233;
  }
  &_form {
    width: 100%;
    &_input {
      margin-bottom: 16px;
      border-radius: 4px 4px 4px 4px;
    }
    &_btn {
      height: 44px !important;
      border-radius: 4px 4px 4px 4px;
    }
    &_submit {
      width: 100%;
      height: 44px;
      background: #1890ff;
      border-radius: 4px 4px 4px 4px;
      @include CenterHorVertical();
      &_text {
        font-family: PingFang SC;
        font-size: 16px;
        font-weight: 400;
        color: #ffffff;
      }
    }
    &_submit:active {
      opacity: 0.8;
    }
    &_tips {
      display: flex;
      align-items: center;
      width: 100%;
      &_text {
        font-size: 14px;
        line-height: 14px;
        color: #cdcdcd;
      }
    }
  }
}
:deep(.wd-input) {
  display: flex;
  align-items: center;
  height: 44px;
  padding-left: 15px;
  background: #f2f3f5 !important;
}
:deep(.wd-picker__cell) {
  background: #f2f3f5 !important;
}
:deep(.wd-input__placeholder) {
  font-weight: 500 !important;
  color: #262626 !important;
}
:deep(.wd-picker__placeholder) {
  font-weight: 500 !important;
  color: #262626 !important;
}
:deep(.wd-picker__label) {
  width: auto !important;
  margin-right: 8px !important;
}
.inputIcon {
  width: 14px;
  height: 20px;
}
.inputIcon2 {
  width: 20px;
  height: 16px;
}
.inputIcon3 {
  width: 18px;
  height: 18px;
}
</style>
