import { http } from '@/utils/http'

// 地图WebserviceAPI驾车路线规划接口
export const getDrivingPath = (params: any) => {
  return http.get(
    '/ws/direction/v1/driving',
    { key: import.meta.env.VITE_MAP_KEY, ...params },
    true,
  )
}
