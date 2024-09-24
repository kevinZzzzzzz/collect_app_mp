import { http } from '@/utils/http'
import { isMp } from '@/utils/platform'
const isDev = import.meta.env.DEV
const baseUrl = import.meta.env.VITE_SERVER_BASEURL
const uaaUrl = import.meta.env.VITE_SERVER_UAAURL
// 设置代理
const setProxy = (url: string): string => {
  if (isDev && !isMp) {
    if (url.includes('/uaa')) {
      return '/uaaApi' + url
    }
    return '/api' + url
  }
  if (url.includes('/uaa')) {
    return uaaUrl + '/uaaApi' + url
  }
  return baseUrl + url
}
/*
  获取公钥
*/
export const $apiGetPublicKey = () => {
  return http.get(setProxy(`/uaa/coldchain/api/key/getPublicKey`), null)
}
/*
  登录
*/
export const $apiLogin = (params: any) => {
  return http.post(
    setProxy('/uaa/coldchain/api/user/loginByAccount'),
    params,
    null,
    false,
    true,
    true,
  )
}
