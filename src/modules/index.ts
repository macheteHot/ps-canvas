import Dom from './dom'
// import { rayCasting, getLayerPolygonByOffset } from './calculate.ts.back'
import Flatten from '@flatten-js/core'

import { TextLayer, ImageLayer } from './layer'
import { MyImage } from './Image'
import { Operte } from './operte'
import { ActionTypes } from '../Interface'

type layer = ImageLayer|TextLayer
type Layers = layer[]

export default class PhotoShop {
  private canvas:HTMLCanvasElement
  private defaultImg:HTMLImageElement
  private ctx:CanvasRenderingContext2D
  private layers:Layers
  private operElement:Operte[]
  private currentAction:ActionTypes

  // private act

  constructor () {
    this.canvas = Dom.canvas
    this.defaultImg = null
    this.canvas.width = 0
    this.canvas.height = 0
    this.ctx = this.canvas.getContext('2d')
    this.layers = []
    this.operElement = []
  }

  public getCanvas (): HTMLCanvasElement {
    return this.canvas
  }

  public setCanvas (canvas: HTMLCanvasElement): void {
    this.canvas = canvas
  }

  public getDefaultImg (): HTMLImageElement {
    return this.defaultImg
  }

  public setDefaultImg (defaultImg: HTMLImageElement): void {
    this.defaultImg = defaultImg
  }

  public getCtx (): CanvasRenderingContext2D {
    return this.ctx
  }

  public setCtx (ctx: CanvasRenderingContext2D): void {
    this.ctx = ctx
  }

  public getLayers (): Layers {
    return this.layers
  }

  public setLayers (layers: Layers): void {
    this.layers = layers
  }

  public getOperElement (): Operte[] {
    return this.operElement
  }

  public setOperElement (operElement: Operte[]): void {
    this.operElement = operElement
  }

  public chooseLayerById (id:string):void {
    this.layers.forEach(layer => {
      layer.choose = layer.id === id
    })
  }

  public getCurrentAction (): ActionTypes {
    return this.currentAction
  }

  public setCurrentAction (currentAction: ActionTypes): void {
    this.currentAction = currentAction
  }

  /**
  * 根据点获取所有包含点的图层 倒序排列 不包含底图
  */
  public getLayersIdByPoint (point:Flatten.Point):string[] {
    const idList = []
    for (let i = this.layers.length - 1; i > 0; i--) {
      const layer = this.layers[i]
      if (layer.geometry.value.contains(point)) {
        idList.push(layer.id)
      }
      // todo add other type
    }
    return idList
  }

  /**
   * 重新绘制
   */
  private reDraw ():void {
    const [a, ...layers] = this.layers
    const defaultLatyer = a as ImageLayer
    defaultLatyer.mousein = () => {
      this.canvas.style.cursor = 'default'
    }

    this.canvas.width = defaultLatyer.width
    this.canvas.height = defaultLatyer.height
    this.ctx.clearRect(0, 0, defaultLatyer.width, defaultLatyer.height)
    this.ctx.drawImage(
      defaultLatyer.source,
      defaultLatyer.geometry.value.box.xmin,
      defaultLatyer.geometry.value.box.ymin,
    )

    const addOperatePoint = (x:number, y:number, radius = 5, fill = true, color = '#000') => {
      this.ctx.beginPath()
      this.ctx.strokeStyle = color
      this.ctx.arc(x, y, radius, 0, 2 * Math.PI)
      this.ctx.fillStyle = color
      if (fill) {
        this.ctx.fill()
      }
      this.ctx.closePath()
      this.ctx.stroke()
      return Flatten.circle(Flatten.point(x, y), radius)
    }

    const addOperateBox = (layer:layer, padding = 15) => {
      const { xmax, xmin, ymax, ymin, center } = layer.geometry.value.box
      const { x:centerX, y:centerY } = center
      const { id:layerId } = layer
      this.ctx.strokeStyle = '#000'
      this.ctx.lineWidth = 1
      this.ctx.moveTo(xmin - padding, ymin - padding)
      this.ctx.lineTo(xmax + padding, ymin - padding)
      this.ctx.lineTo(xmax + padding, ymax + padding)
      this.ctx.lineTo(xmin - padding, ymax + padding)
      this.ctx.lineTo(xmin - padding, ymin - padding)
      this.ctx.stroke()
      this.ctx.moveTo(centerX, ymin - padding) // add line
      this.ctx.lineTo(centerX, ymin - padding - 40)
      this.ctx.stroke()
      const topRote = addOperatePoint(centerX, ymin - padding - 40)
      this.operElement.push(new Operte(topRote, 'grabbing', layerId))
      const topLeft = addOperatePoint(xmin - padding, ymin - padding)
      this.operElement.push(new Operte(topLeft, 'nwse-resize', layerId))
      const topCenter = addOperatePoint(centerX, ymin - padding)
      this.operElement.push(new Operte(topCenter, 'n-resize', layerId))
      const topRight = addOperatePoint(xmax + padding, ymin - padding)
      this.operElement.push(new Operte(topRight, 'nesw-resize', layerId))
      const rightCenter = addOperatePoint(xmax + padding, centerY)
      this.operElement.push(new Operte(rightCenter, 'e-resize', layerId))
      const rightBottom = addOperatePoint(xmax + padding, ymax + padding)
      this.operElement.push(new Operte(rightBottom, 'nwse-resize', layerId))
      const bottonCenter = addOperatePoint(centerX, ymax + padding) // bottom center
      this.operElement.push(new Operte(bottonCenter, 'n-resize', layerId))
      const bottomLeft = addOperatePoint(xmin - padding, ymax + padding)
      this.operElement.push(new Operte(bottomLeft, 'nesw-resize', layerId))
      const leftCenter = addOperatePoint(xmin - padding, centerY) // left center
      this.operElement.push(new Operte(leftCenter, 'e-resize', layerId))
    }
    this.operElement = []
    layers.forEach(_ => {
      if (_.geometry.type === 'image') {
        const layer = _ as ImageLayer
        const { xmax, xmin, ymax, ymin } = layer.geometry.value.box
        if (layer.rotate !== 0) { // has rotate
          const { x, y } = layer.geometry.value.box.center
          this.ctx.translate(x, y)
          this.ctx.rotate(layer.rotate)
          this.ctx.drawImage(layer.source, (0 - xmin) / 2, (0 - ymin) / 2)
          this.ctx.translate(-x, -y)
        } else {
          this.ctx.drawImage(
            layer.source,
            xmin + layer.offsetX,
            ymin + layer.offsetY,
            xmax - xmin,
            ymax - ymin,
          )
        }

        this.ctx.translate(0, 0)
        if (layer.choose && this.currentAction === ActionTypes.rotate) {
          addOperateBox(layer)
        }
      }
    })
  }

  /**
   * 根据id获取图层
   */
  public getLayerById (layerId:string):ImageLayer|TextLayer|undefined {
    return this.layers.find(({ id }) => id === layerId)
  }

  /**
   *  根据偏移量移动图层
   */
  public moveLayerById (point:Flatten.Vector, layerId:string):void {
    const layer = this.getLayerById(layerId)
    if (this.layers[0].id === layerId) {
      throw new Error('this.id is not correct')
    }
    if (layer) {
      layer.offsetX = point.x
      layer.offsetY = point.y
      this.reDraw()
    }
  }

  // 移动完成
  public moveLayerEndById (layerId:string):void {
    const layer = this.getLayerById(layerId)
    if (layer) {
      if (layer.geometry.value instanceof Flatten.Polygon) {
        layer.geometry.value = layer.geometry.value.translate(new Flatten.Vector(layer.offsetX, layer.offsetY))
        layer.offsetX = 0
        layer.offsetY = 0
      }
    }
    this.reDraw()
  }

  public roateLayerById (layerId:string, angle:number):void {
    const layer = this.getLayerById(layerId)
    if (layer && layer.geometry.value instanceof Flatten.Polygon) {
      layer.rotate = angle
      layer.geometry.value = layer.geometry.value.rotate(angle, layer.geometry.value.box.center)
    }
    this.reDraw()
  }

  public sortLayer (idList:string):void {
    this.layers = this.layers.sort((a, b) => idList.indexOf(b.id) - idList.indexOf(a.id))
    this.reDraw()
  }

  public delLayerById (layerId:string):void {
    this.layers = this.layers.filter(layer => layer.id !== layerId)
    this.reDraw()
  }

  public addLayerImg (img:MyImage):void {
    this.layers.push(new ImageLayer(img))
    this.reDraw()
  }
}
