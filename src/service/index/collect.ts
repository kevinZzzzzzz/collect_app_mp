import { http } from '@/utils/http'
import { isMp } from '@/utils/platform'
const isDev = import.meta.env.DEV
const baseUrl = import.meta.env.VITE_SERVER_BASEURL
// 设置代理
const setProxy = (url: string): string => {
  if (isDev && !isMp) {
    return '/api' + url
  }
  return baseUrl + url
}
// 获取数据列表
export const $apiGetCollectList = (params: any) => {
  return http.get(setProxy('/data/api/outBoundOrder/list/group'), { ...params })
}
// 获取数据详情
export const $apiGetCollectItemDetail = (params: any) => {
  return http.get(setProxy('/data/api/outBoundOrder/list/one'), { ...params })
}
// 创建运单
export const $apiAddTransOrder = (params: any) => {
  return http.post(setProxy('/data/api/transportOrder/outbound/add'), params)
}
// 开始启运
export const $apiStartTransOrder = (params: any) => {
  return http.post(setProxy('/data/api/transportOrder/start'), params)
}
