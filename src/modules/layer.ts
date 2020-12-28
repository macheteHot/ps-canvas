import { polygon } from './interface'
import { MyImage } from './Image'
import Utils from '../util'

export default class Layer {
  x: number
  y: number
  id: string
  name: string
  source: MyImage // 源
  type: string
  polylinePoints: polygon
  offsetX: number
  offsetY: number
  rote: number
  width: number
  height: number
  constructor (img: MyImage, x = 0, y = 0) {
    const [, name, type] = img.fileName.match(/^([\s\S]+)\.([a-zA-Z]+)$/)
    const { width, height } = img
    this.id = Utils.GeneratorUuid()
    this.name = name
    this.source = img
    this.type = type
    // 所有点的坐标 [[x,y]] 形成闭环
    this.polylinePoints = [
      [0, 0],
      [width, 0],
      [width, height],
      [0, height],
      [0, 0],
    ]
    this.x = x
    this.y = y
    this.offsetX = 0
    this.offsetY = 0
    this.rote = 0
    this.width = width
    this.height = height
  }
}
