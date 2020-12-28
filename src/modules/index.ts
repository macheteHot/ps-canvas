import Dom from './dom'
// import { rayCasting, getLayerPolygonByOffset } from './calculate.ts.back'
import Flatten from '@flatten-js/core'

import Layer from './layer'
import { MyImage } from './Image'

export default class PhotoShop {
  private canvas:HTMLCanvasElement
  private defaultImg:HTMLImageElement
  private ctx:CanvasRenderingContext2D
  private layers:Layer[]

  constructor () {
    this.canvas = Dom.canvas
    this.defaultImg = null
    this.canvas.width = 0
    this.canvas.height = 0
    this.ctx = this.canvas.getContext('2d')
    this.layers = []
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

  public getLayers (): Layer[] {
    return this.layers
  }

  public setLayers (layers: Layer[]): void {
    this.layers = layers
  }

  public chooseLayerById (id:string) {
    this.layers.forEach(layer => {
      layer.choose = layer.id === id
    })
  }

  /**
  * 根据点获取所有包含点的图层 倒序排列 不包含底图
  */
  public getLayersIdByPoint (point:Flatten.Point):string[] {
    const idList = []
    for (let i = this.layers.length - 1; i > 0; i--) {
      const layer = this.layers[i]
      if (layer.polylinePoints.contains(point)) {
        idList.push(layer.id)
      }
    }
    return idList
  }

  /**
   * 重新绘制
   */
  private reDraw ():void {
    const [defaultLatyer, ...layers] = this.layers
    this.canvas.width = defaultLatyer.width
    this.canvas.height = defaultLatyer.height
    this.ctx.clearRect(0, 0, defaultLatyer.width, defaultLatyer.height)
    this.ctx.drawImage(defaultLatyer.source, defaultLatyer.x, defaultLatyer.y)
    layers.forEach(layer => {
      this.ctx.drawImage(layer.source, layer.x + layer.offsetX, layer.y + layer.offsetY)
      if (layer.choose) {
        this.ctx.strokeStyle = 'red'
        this.ctx.lineWidth = 6
        this.ctx.strokeRect(layer.x + layer.offsetX, layer.y + layer.offsetY, layer.width, layer.height)
      }
    })
  }

  /**
   * 根据id获取图层
   */
  public getLayerById (layerId:string):Layer|undefined {
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
      layer.polylinePoints = layer.polylinePoints.translate(new Flatten.Vector(layer.offsetX, layer.offsetY))
      layer.x = layer.x + layer.offsetX
      layer.y = layer.y + layer.offsetY
      layer.offsetX = 0
      layer.offsetY = 0
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
    this.layers.push(new Layer(img))
    this.reDraw()
  }

  public getAllLayers ():Layer[] {
    return this.layers
  }
}
