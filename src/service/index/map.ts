import { http } from '@/utils/http'
import { isMp } from '@/utils/platform'
const isDev = import.meta.env.DEV
const mapUrl = import.meta.env.VITE_MAP_SERVER_BASEURL
// 设置代理
const setProxy = (url: string): string => {
  if (isDev && !isMp) {
    return '/mapApi' + url
  }
  return mapUrl + url
}
// 地图WebserviceAPI驾车路线规划接口
export const $apiGetDrivingPath = (params: any) => {
  return http.get(
    setProxy('/ws/direction/v1/driving'),
    null,
    { key: import.meta.env.VITE_MAP_KEY, ...params },
    true,
  )
}
