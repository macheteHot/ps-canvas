import { point, polygon } from './interface'
import Layer from './layer'
/**
 * 计算点是否在坐标系内
 * @param p
 * @param poly
 */
export function rayCasting (p:point, poly:polygon):boolean {
  const px = p.x
  const py = p.y
  let flag = false
  for (let i = 0, l = poly.length, j = l - 1; i < l; j = i, i++) {
    const sx = poly[i][0]
    const sy = poly[i][1]
    const tx = poly[j][0]
    const ty = poly[j][1]
    if ((sx === px && sy === py) || (tx === px && ty === py)) {
      return false
    }
    if ((sy < py && ty >= py) || (sy >= py && ty < py)) {
      const x = sx + (py - sy) * (tx - sx) / (ty - sy)
      if (x === px) {
        return false
      }
      if (x > px) {
        flag = !flag
      }
    }
  }
  return flag
}
// 重新计算坐标系
export function getLayerPolygonByOffset (layer:Layer, offsetX:number, offsetY:number):polygon {
  const { x, y, width, height } = layer
  return [
    [x + offsetX, y + offsetY],
    [width + offsetX + x, offsetY + y],
    [width + offsetX + x, height + offsetY + y],
    [offsetX + x, height + offsetY + y],
    [offsetX + x, offsetY + y],
  ]
}
