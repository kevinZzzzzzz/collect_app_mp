import { CustomRequestOptions } from '@/interceptors/request'
import { useUserStore } from '@/store/user'
import PLATFORM from '@/utils/platform'

const successCode = [0, 200] // 成功的返回code
const failCode = [1, 101, -100, 500] // 失败的返回code
const loginFailCode = [403] // 登录失效

const loadingMsg = '请稍候...'
const isDev = import.meta.env.DEV
const userStore = useUserStore()

const appProxy = import.meta.env.VITE_APP_PROXY
const appMapProxy = import.meta.env.VITE_APP_MAP_PROXY
const appProxyPrefix = import.meta.env.VITE_APP_PROXY_PREFIX
const appMapProxyPrefix = import.meta.env.VITE_APP_MAP_PROXY_PREFIX

export const http = <T>(options: any) => {
  options.showLoading && uni.showLoading({ title: loadingMsg })
  // 1. 返回 Promise 对象
  return new Promise<IResData<T>>((resolve, reject) => {
    uni.request({
      ...options,
      token: userStore.userToken,
      dataType: 'json',
      // #ifndef MP-WEIXIN
      responseType: 'json',
      // #endif
      // 响应成功
      success(res) {
        options.showLoading && uni.hideLoading()
        // 状态码 2xx，参考 axios 的设计
        if (res.statusCode === 200) {
          // 2.1 提取核心数据 res.data
          const { code, status, msg } = res.data as any
          if (successCode.includes(+code) || successCode.includes(+status)) {
            resolve(res.data as IResData<T>)
          } else if (failCode.includes(+code) || failCode.includes(+status)) {
            options.showToast &&
              msg &&
              uni.showToast({
                icon: 'error',
                title: msg || '请求失败',
              })
            reject(res)
          } else if (loginFailCode.includes(+code)) {
            uni.showToast({
              icon: 'error',
              title: '登录失效',
            })
            userStore.clearUserInfo()
            uni.navigateTo({ url: '/pages/login/index' })
            reject(res)
          }
        } else if (res.statusCode === 401) {
          // 401错误  -> 清理用户信息，跳转到登录页
          // userStore.clearUserInfo()
          // uni.navigateTo({ url: '/pages/login/login' })
          reject(res)
        } else {
          // 其他错误 -> 根据后端错误信息轻提示
          !options.hideErrorToast &&
            uni.showToast({
              icon: 'none',
              title: (res.data as IResData<T>).msg || '请求错误',
            })
          reject(res)
        }
      },
      // 响应失败
      fail(err) {
        uni.showToast({
          icon: 'none',
          title: '网络错误，换个网络试试',
        })
        reject(err)
      },
    })
  })
}

/**
 * GET 请求
 * @param url 后台地址
 * @param query 请求query参数
 * @param isMap 是否是地图接口
 * @param showToast 是否显示错误提示
 * @param showLoading 是否显示loading
 * @returns
 */
export const httpGet = <T>(
  url: string,
  query?: Record<string, any>,
  isMap?: boolean,
  showToast?: boolean,
  showLoading?: boolean,
) => {
  return http<T>({
    url,
    query,
    method: 'GET',
    isMap,
    showToast,
    showLoading,
  })
}

/**
 * POST 请求
 * @param url 后台地址
 * @param data 请求body参数
 * @param query 请求query参数，post请求也支持query，很多微信接口都需要
 * @param isMap 是否是地图接口
 * @param showToast 是否显示错误提示
 * @param showLoading 是否显示loading
 * @returns
 */
export const httpPost = <T>(
  url: string,
  data?: Record<string, any>,
  query?: Record<string, any>,
  isMap?: boolean,
  showToast?: boolean,
  showLoading?: boolean,
) => {
  return http<T>({
    url,
    query,
    data,
    method: 'POST',
    isMap,
    showToast,
    showLoading,
  })
}

http.get = httpGet
http.post = httpPost
