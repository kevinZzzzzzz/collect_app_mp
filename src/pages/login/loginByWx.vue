<route lang="json5">
{
  style: {
    navigationBarTitleText: '登录',
  },
}
</route>
<template>
  <div class="loginByWx pageCenter">
    <div class="loginByWx_avatar">
      <image class="loginByWx_avatar_img" src="@img/userAvatar.png" mode="scaleToFill" />
    </div>
    <div class="loginByWx_info">
      <p class="loginByWx_info_name">{{ userInfo.username }}</p>
      <p class="loginByWx_info_tel">{{ userInfo.telephone }}</p>
    </div>
    <div class="loginByWx_submit">
      <span class="loginByWx_submit_text">一键授权登录</span>
    </div>
    <p class="loginByWx_tips">您已通过微信绑定以上账号，可直接登录</p>
    <div class="loginByWx_bottom">
      <div class="loginByWx_bottom_exit">
        <wd-button type="text">退出并切换登录账号</wd-button>
      </div>
      <div class="loginByWx_bottom_ctx">
        <p class="loginByWx_bottom_ctx_text">本服务由宝安中心血站授权</p>
        <p class="loginByWx_bottom_ctx_text">深圳穿越医疗有限公司提供技术支持</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
defineOptions({
  name: 'loginByWx',
})
const userInfo = ref({
  username: '张三',
  telephone: '1350***0000',
})
</script>

<style scoped lang="scss">
.loginByWx {
  position: relative;
  justify-content: flex-start;
  height: calc(100vh - 44px);
  padding: 70px 16px 32px;
  &_avatar {
    width: 120px;
    height: 120px;
    &_img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  &_info {
    margin-top: 14px;
    &_name {
      font-family: PingFang SC;
      font-size: 20px;
      font-weight: 600;
      color: #323233;
      text-align: center;
    }
    &_tel {
      margin-top: 4px;
      font-family: PingFang SC;
      font-size: 16px;
      font-weight: 400;
      color: #aaa;
    }
  }
  &_submit {
    width: 100%;
    height: 44px;
    margin-top: 44px;
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
    margin-top: 12px;
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: 400;
    color: #323233;
  }
  &_bottom {
    position: absolute;
    bottom: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    &_ctx {
      margin-top: 42px;
      &_text {
        font-family: PingFang SC;
        font-size: 14px;
        font-weight: 400;
        color: #c8c9cc;
        text-align: center;
      }
    }
  }
}
:deep(.wd-button__text) {
  text-decoration: underline;
  text-underline-offset: 4px;
}
</style>
