<route lang="json5">
{
  style: {
    navigationBarTitleText: '人脸识别认证',
  },
}
</route>
<template>
  <div class="face pageCenter">
    <image class="face_img" src="@img/faceDefault.png" mode="scaleToFill" />
    <div class="face_text">
      请进行人脸识别认证身份，并确保是
      <br />
      <span class="face_text_info">张三（42112*****3144）</span>
      本人操作
    </div>
    <div class="face_tips">
      <image class="face_tips_img" src="@img/tipsIcon.png" mode="scaleToFill" />
      人脸识别通过后15天内无需重复核验
    </div>
    <div class="face_submit">
      <span class="face_submit_text">开始识别</span>
    </div>
    <div class="face_btm">
      <image class="face_btm_img" src="@img/netCertIcon.png" mode="scaleToFill" />
      <div class="face_btm_right">
        <p class="face_btm_right_text">实名认证及人脸识别对比技术</p>
        <p class="face_btm_right_text">由公安部CTID提供支持</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
defineOptions({
  name: 'Face',
})
const faceInfo = ref({
  username: '张三',
  idCard: '440302*****001X',
})
</script>

<style scoped lang="scss">
.face {
  padding: 110px 16px;
  &_img {
    width: 190px;
    height: 181px;
    margin-bottom: 36px;
  }
  &_text {
    margin-bottom: 16px;
    font-family: PingFang SC;
    font-size: 16px;
    font-weight: 400;
    color: #323233;
    &_info {
      color: #1890ff;
    }
  }
  &_tips {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    font-weight: normal;
    color: #faab0c;
    &_img {
      width: 14px;
      height: 14px;
      margin-right: 6px;
    }
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
  &_btm {
    display: flex;
    margin-top: 102px;
    &_img {
      width: 38px;
      height: 36px;
      margin-right: 8px;
    }
    &_right {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: PingFang SC;
      font-size: 12px;
      font-weight: 400;
      color: #c8c9cc;
    }
  }
}
</style>
