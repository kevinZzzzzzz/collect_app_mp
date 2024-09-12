<route lang="json5">
{
  style: {
    navigationBarTitleText: '登录',
  },
}
</route>
<template>
  <div class="login pageCenter">
    <image class="login_logo" src="@img/logo.png" mode="scaleToFill" />
    <h1 class="login_title">穿越血液服务</h1>
    <div class="login_form">
      <div class="login_form_input">
        <wd-input
          center
          clearable
          use-prefix-slot
          no-border
          v-model="loginInfo.telephone"
          size="midium"
          placeholder="请输入您的手机号"
        >
          <template #prefix>
            <image class="inputIcon" src="@img/telIcon.png" mode="scaleToFill" />
          </template>
        </wd-input>
      </div>
      <div class="login_form_input authLine">
        <wd-input
          center
          clearable
          use-prefix-slot
          no-border
          v-model="loginInfo.authCode"
          size="midium"
          placeholder="验证码"
        >
          <template #prefix>
            <image class="inputIcon2" src="@img/authIcon.png" mode="scaleToFill" />
          </template>
        </wd-input>
        <wd-button
          custom-class="sendCode"
          v-if="waitAuthCode"
          class="login_form_btn"
          :disabled="waitAuthTime"
          :type="waitAuthTime ? 'info' : 'primary'"
          plain
          hairline
          size="large"
          @click="resendCode()"
        >
          {{ `重新发送（${waitAuthTime}s）` }}
        </wd-button>
        <wd-button
          custom-class="sendCode"
          v-else
          class="login_form_btn"
          plain
          hairline
          size="large"
          @click="getAuthCode()"
        >
          获取验证码
        </wd-button>
      </div>
    </div>
    <div
      :class="[
        'login_form_submit',
        !loginInfo.agreeProtocol ? 'login_form_submit-disable' : 'login_form_submit-able',
      ]"
    >
      <span class="login_form_submit_text">确认登录</span>
    </div>
    <div class="login_form_tips">
      <wd-checkbox v-model="loginInfo.agreeProtocol"></wd-checkbox>
      <div class="login_form_tips_text">
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
  name: 'Login',
})
let waitTimer = null
const sendMinute = 10
const loginInfo = ref({
  telephone: '',
  authCode: '',
  agreeProtocol: false,
})
const waitAuthCode = ref(false) // 等待验证码
const waitAuthTime = ref(sendMinute) // 等待倒计时

/**
 * 获取验证码
 */
const getAuthCode = () => {
  waitAuthCode.value = true
  waitTimer = setInterval(() => {
    waitAuthTime.value -= 1
    if (waitAuthTime.value <= 0) {
      clearInterval(waitTimer)
    }
  }, 1000)
}
/**
 * 重新发送验证码
 */
const resendCode = () => {
  if (waitAuthTime.value > 0) return
  waitAuthTime.value = sendMinute
  getAuthCode()
}
</script>

<style scoped lang="scss">
.login {
  padding: 56px 16px 0;
  &_logo {
    width: 66px;
    height: 66px;
    margin-bottom: 16px;
  }
  &_title {
    margin-bottom: 40px;
    font-family: PingFang SC;
    font-size: 20px;
    font-weight: bold;
    line-height: 17px;
    color: #323233;
  }
  &_subTitle {
    margin-bottom: 30px;
    font-family: PingFang SC;
    font-size: 16px;
    font-weight: 500;
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
      &-disable {
        opacity: 0.5;
      }
      &-able {
        opacity: 1;
      }
      &-able:active {
        opacity: 0.8;
      }
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
.authLine {
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 9px;
  margin-bottom: 33px;
}
:deep(.wd-input) {
  display: flex;
  align-items: center;
  height: 44px;
  padding-left: 15px;
  background: #f2f3f5;
}
.sendCode {
  width: 98%;
  padding: 0 15px !important;
}
.inputIcon {
  width: 14px;
  height: 20px;
}
.inputIcon2 {
  width: 20px;
  height: 16px;
}
</style>
