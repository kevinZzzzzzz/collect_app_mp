/**
 *
 * @method {*} getCenterLonLat 获取两个坐标点的中间点坐标
 * @param {*} point1 第一个点的经纬度
 * @param {*} point2 第二个点的经纬度
 */
export function getCenterLonLat(point1, point2) {
  let aLon = 0,
    aLat = 0
  const bLon = Number(point1[0]) - Number(point2[0])
  const bLat = Number(point1[1]) - Number(point2[1])
  //Math.abs()绝对值
  if (bLon > 0) {
    aLon = Number(point1[0]) - Math.abs(bLon) / 2
  } else {
    aLon = Number(point2[0]) - Math.abs(bLon) / 2
  }
  if (bLat > 0) {
    aLat = Number(point1[1]) - Math.abs(bLat) / 2
  } else {
    aLat = Number(point2[1]) - Math.abs(bLat) / 2
  }
  return [aLon - 0.005, aLat + 0.01]
}
/**
 *
 * @method {*} getZoomLevel 计算两点最佳zoom值
 * @param {*} bounds 两点经纬度列表
 *  */
export const getZoomLevel = (
  bounds: [Array<number>, Array<number>],
  mapDim: [number, number] = [800, 600],
): number => {
  const WORLD_DIM = 256
  const ZOOM_MAX = 21

  const ne = bounds[0]
  const sw = bounds[1]

  const latDiff = Math.abs(ne[0] - sw[0])
  const lngDiff = Math.abs(ne[1] - sw[1])
  const latZoom = Math.log((mapDim[0] * 360) / latDiff / WORLD_DIM) / Math.log(2)
  const lngZoom = Math.log((mapDim[1] * 180) / lngDiff / WORLD_DIM) / Math.log(2)
  return +Math.min(Math.min(latZoom, lngZoom), ZOOM_MAX).toFixed(0) - 1
}
