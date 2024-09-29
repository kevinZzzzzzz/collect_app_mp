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
      <!-- <div class="login_form_input">
        <wd-input
          center
          clearable
          use-prefix-slot
          no-border
          v-model="loginInfo.username"
          size="midium"
          placeholder="请输入账号"
        >
          <template #prefix>
            <image class="inputIcon" src="@img/telIcon.png" mode="scaleToFill" />
          </template>
        </wd-input>
      </div>
      <div class="login_form_input">
        <wd-input
          center
          clearable
          use-prefix-slot
          no-border
          show-password
          v-model="loginInfo.password"
          size="midium"
          placeholder="请输入密码"
        >
          <template #prefix>
            <image class="inputIcon2" src="@img/authIcon.png" mode="scaleToFill" />
          </template>
        </wd-input>
      </div> -->
    </div>
    <div
      @click="login()"
      :class="[
        'login_form_submit',
        !canLogin ? 'login_form_submit-disable' : 'login_form_submit-able',
      ]"
    >
      <span class="login_form_submit_text">确认登录</span>
    </div>
    <div class="login_form_tips">
      <wd-checkbox v-model="loginInfo.agreeProtocol"></wd-checkbox>
      <div class="login_form_tips_text">
        我已阅读并同意
        <wd-button type="text" @click="gotoPDF('用户协议')">《用户协议》</wd-button>
        与
        <wd-button type="text" @click="gotoPDF('隐私政策')">《隐私政策》</wd-button>
      </div>
    </div>
  </div>
  <wd-toast />
</template>

<script setup lang="ts">
import {
  $apiGetPublicKey,
  $apiLogin,
  $apiLoginByPhone,
  $apiGetSendCode,
} from '@/service/index/common'
import { encrypt, getNavigateOptions, getUserInfoByToken } from '@/utils'
import { useUserStore } from '@/store'
import { ref } from 'vue'
import { telReg } from '@/constant/index'

const docsUrl = import.meta.env.VITE_SERVER_DOCSURL

defineOptions({
  name: 'Login',
})
const userStore = useUserStore()

let waitTimer = null
const sendMinute = 60
const loginInfo = ref({
  telephone: '',
  authCode: '',
  // username: '',
  // password: '',
  agreeProtocol: false,
})
// const publicKey = ref('')
const waitAuthCode = ref(false) // 等待验证码
const waitAuthTime = ref(sendMinute) // 等待倒计时

/**
 * 是否可以登录
 */
const canLogin = computed(() => {
  return loginInfo.value.agreeProtocol && loginInfo.value.telephone && loginInfo.value.authCode
})
/**
 * 获取验证码
 */
const getAuthCode = () => {
  if (!loginInfo.value.telephone) {
    uni.showToast({
      icon: 'none',
      title: '请输入手机号',
    })
    return false
  }
  if (loginInfo.value.telephone && !telReg.test(loginInfo.value.telephone)) {
    uni.showToast({
      icon: 'none',
      title: '请输入正确的手机号',
    })
    return false
  }
  if (waitAuthCode.value) return false

  $apiGetSendCode({
    phone: loginInfo.value.telephone,
  }).then((res: any) => {
    uni.showToast({
      icon: 'success',
      title: `验证码已发送到${loginInfo.value.telephone}`,
    })
    waitAuthCode.value = true
    waitTimer = setInterval(() => {
      waitAuthTime.value -= 1
      if (waitAuthTime.value <= 0) {
        clearInterval(waitTimer)
        waitAuthTime.value = 60
        waitAuthCode.value = false
      }
    }, 1000)
  })
}
/**
 * 重新发送验证码
 */
const resendCode = () => {
  if (waitAuthTime.value > 0) return
  waitAuthTime.value = sendMinute
  getAuthCode()
}

const login = () => {
  if (!canLogin.value) return false
  const obj = {
    phone: loginInfo.value.telephone,
    code: loginInfo.value.authCode,
  }
  $apiLoginByPhone(obj).then((res: any) => {
    const userInfo = getUserInfoByToken(res.data) // 解析token 获取保存个人信息
    userStore.setUserInfo(userInfo)
    userStore.setUserToken(res.data)
    uni.showToast({
      icon: 'success',
      title: '登录成功',
    })
    setTimeout(() => {
      uni.navigateTo({
        url: '/pages/index/index',
      })
    }, 500)
  })
}
// // 获取公钥
// const getPublicKeys = () => {
//   $apiGetPublicKey().then((res: any) => {
//     publicKey.value = res.data
//     uni.setStorage({
//       key: 'publicKey',
//       data: res.data,
//     })
//   })
// }
/**
 * 跳转协议
 * @param name
 */
const gotoPDF = (name) => {
  //  是区分运行的环境，在小程序中可使用如下方法
  /* #ifdef MP */
  uni.downloadFile({
    url: `${docsUrl}/docs/${name}.pdf`, //文件地址
    success: function (res) {
      var filePath = res.tempFilePath
      uni.openDocument({
        filePath: filePath,
        showMenu: false, //这个参数可设置你预览的文件能否被直接转发，此次是设置是否展示分享菜单
        success: function (res) {
          console.log('打开文档成功', res)
        },
      })
    },
  })
  /* #endif */
  /* #ifdef H5 */ //这里是H5中的写法
  // uni.navigateTo({
  //   url: `/packageB/protocol/index?protocolName=${name}`,
  // })
  window.open(`${docsUrl}/docs/${name}.pdf`)
  /* #endif */
}
onMounted(() => {
  // getPublicKeys()
})
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
  padding: 0 15px;
  background: #f2f3f5;
}
:deep(.wd-input__icon) {
  background: #f2f3f5;
}
:deep(.wd-button.is-plain.is-primary) {
  background: #fff !important;
  color: #1890ff !important;
  border-radius: 4px 4px 4px 4px;
  border: 1px solid #1890ff;
}
:deep(.wd-button.is-disabled) {
  padding: 0 15px !important;
}

:deep(.wd-button.is-text) {
  color: #1890ff !important;
  font-weight: 400;
  font-size: 14px;
}
:deep(.wd-checkbox.is-checked .wd-checkbox__shape) {
  color: #1890ff !important;
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
