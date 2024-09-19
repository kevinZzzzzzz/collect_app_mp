import { http } from '@/utils/http'

// 获取数据列表
export const getCollectList = (params: any) => {
  return http.get('/data/api/outBoundOrder/list/group', { ...params })
}
// 获取数据详情
export const getCollectItemDetail = (params: any) => {
  return http.get('/data/api/outBoundOrder/list/one', { ...params })
}

// 创建运单
export const addTransOrder = (params: any) => {
  return http.post('/data/api/transportOrder/outbound/add', params)
}
// 开始启运
export const startTransOrder = (params: any) => {
  return http.post('/data/api/transportOrder/start', params)
}
