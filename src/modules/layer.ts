import Utils from '../util'
import { MyImage } from './Image'
import Flatten from '@flatten-js/core'
import { ActionTypes, anyObj, LayerTagNameMap, Geometry } from '../Interface'

export function createdGeometry<T extends keyof LayerTagNameMap> (type:T, value:LayerTagNameMap[T]): { type: T; value: LayerTagNameMap[T]; } {
  return {
    type,
    value: value,
  }
}

class Layer {
  id: string
  geometry:Geometry
  offsetX: number
  offsetY: number
  rotate: number
  properties: anyObj
  choose:boolean
  constructor (geometry:Geometry, rotate = 0, properties = {}, offsetX = 0, offsetY = 0) {
    this.id = Utils.GeneratorUuid()
    this.geometry = geometry
    this.rotate = rotate
    this.properties = properties
    this.offsetX = offsetX
    this.offsetY = offsetY
    this.choose = false
  }

  mousein (ps:HTMLCanvasElement, currentAction:ActionTypes) {
    if (currentAction === ActionTypes.move) {
      ps.style.cursor = 'move'
    }
  }
}

export class ImageLayer extends Layer {
  name: string
  source: HTMLImageElement // 源
  width: number
  height: number
  constructor (myImage: MyImage, x = 0, y = 0) {
    const [, name] = myImage.fileName.match(/^([\s\S]+)\.[a-zA-Z]+$/)
    const { width, height } = myImage.image
    super(createdGeometry('image', new Flatten.Polygon(new Flatten.Box(x, y, width, height))))
    this.name = name
    this.source = myImage.image
    this.width = width
    this.height = height
  }
}

export class TextLayer extends Layer {

}
