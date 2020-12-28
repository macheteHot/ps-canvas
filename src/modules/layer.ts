import Utils from '../util'
import { MyImage } from './Image'
import Flatten from '@flatten-js/core'

export default class Layer {
  x: number
  y: number
  id: string
  name: string
  source: HTMLImageElement // 源
  type: string
  polylinePoints: Flatten.Polygon
  choose:boolean
  offsetX: number
  offsetY: number
  rote: number
  width: number
  height: number
  constructor (myImage: MyImage, x = 0, y = 0) {
    const [, name, type] = myImage.fileName.match(/^([\s\S]+)\.([a-zA-Z]+)$/)
    const { width, height } = myImage.image
    this.id = Utils.GeneratorUuid()
    this.choose = false
    this.name = name
    this.source = myImage.image
    this.type = type
    // 所有点的坐标 [[x,y]] 形成闭环
    this.polylinePoints = new Flatten.Polygon([
      new Flatten.Point(0, 0),
      new Flatten.Point(width, 0),
      new Flatten.Point(width, height),
      new Flatten.Point(0, height),
      new Flatten.Point(0, 0),
    ])
    this.x = x
    this.y = y
    this.offsetX = 0
    this.offsetY = 0
    this.rote = 0
    this.width = width
    this.height = height
  }
}
