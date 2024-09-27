import { http } from '@/utils/http'
import { isMp } from '@/utils/platform'
const isDev = import.meta.env.DEV
// const baseUrl = import.meta.env.VITE_SERVER_BASEURL
const uaaUrl = import.meta.env.VITE_SERVER_UAAURL
// 设置代理
const setProxy = (url: string): string => {
  if (isDev && !isMp) {
    return '/api' + url
  }
  return uaaUrl + '/api' + url
}
// 获取数据列表
export const $apiGetCollectList = (params?: any) => {
  return http.get(setProxy('/data/api/outBoundOrder/list/group'), { ...params })
}
// 获取数据详情
export const $apiGetCollectItemDetail = (params?: any) => {
  return http.get(setProxy('/data/api/outBoundOrder/list/one'), { ...params }, false, true, true)
}
// 创建运单
export const $apiAddTransOrder = (params?: any) => {
  return http.post(
    setProxy('/data/api/transportOrder/outbound/add'),
    params,
    null,
    false,
    true,
    true,
  )
}
// 开始启运
export const $apiStartTransOrder = (params?: any) => {
  return http.post(setProxy('/data/api/transportOrder/start'), params, null, false, true, true)
}
// 查询无人机编号
export const $apiGetAssetCode = (params?: any) => {
  return http.get(setProxy('data/api/uav/get/assetCode'), { ...params }, false, true, true)
}
// 运单签收
export const $apiSignTransOrder = (params?: any) => {
  return http.post(setProxy('/data/api/transportOrder/sign'), params, null, false, true, true)
}
// 运单标记异常
export const $apiTransOrderException = (params?: any) => {
  return http.post(setProxy('/data/api/transportOrder/exception'), params, null, false, true, true)
}
