import { http } from '@/utils/http'
import { isMp } from '@/utils/platform'
const isDev = import.meta.env.DEV
// const baseUrl = import.meta.env.VITE_SERVER_BASEURL
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
  return uaaUrl + '/api' + url
}
/*
  获取公钥
*/
export const $apiGetPublicKey = () => {
  return http.get(setProxy(`/uaa/coldchain/api/key/getPublicKey`), null, null)
}
/*
  获取角色权限
*/
export const $apiGetRoleList = () => {
  return http.get(setProxy(`/uaa/coldchain/api/role/query`), null, null)
}
/*
  获取验证码
*/
export const $apiGetSendCode = (params: any) => {
  return http.get(
    setProxy(`/uaa/coldchain/api/key/sendCode`),
    null,
    params,
    false,
    true,
    true,
    false,
  )
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
/*
  手机号登录
*/
export const $apiLoginByPhone = (params: any) => {
  return http.post(
    setProxy('/uaa/coldchain/api/user/loginByPhone'),
    params,
    null,
    false,
    true,
    true,
    false,
  )
}
