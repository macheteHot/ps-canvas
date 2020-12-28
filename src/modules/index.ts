import Dom from './dom'
import { rayCasting, getLayerPolygonByOffset } from './calculate'
import Layer from './layer'
import { point } from './interface'
import { MyImage } from './Image'

export default class PhotoShop {
  canvas:HTMLCanvasElement
  defaultImg:HTMLImageElement
  ctx:CanvasRenderingContext2D
  layers:Layer[]
  constructor () {
    this.canvas = Dom.canvas
    this.defaultImg = null
    this.canvas.width = 0
    this.canvas.height = 0
    this.ctx = this.canvas.getContext('2d')
    this.layers = []
  }

  /**
  * 根据点获取所有包含点的图层 倒序排列 不包含底图
  */
  getLayersIdByPoint (point:point):string[] {
    const idList = []
    for (let i = this.layers.length - 1; i > 0; i--) {
      const layer = this.layers[i]
      if (rayCasting(point, layer.polylinePoints)) {
        idList.push(layer.id)
      }
    }
    return idList
  }

  /**
   * 重新绘制
   */
  reDraw ():void {
    const [defaultLatyer, ...layers] = this.layers
    this.canvas.width = defaultLatyer.width
    this.canvas.height = defaultLatyer.height
    this.ctx.clearRect(0, 0, defaultLatyer.width, defaultLatyer.height)
    this.ctx.drawImage(defaultLatyer.source, defaultLatyer.x, defaultLatyer.y)
    layers.forEach(layer => {
      this.ctx.drawImage(layer.source, layer.x + layer.offsetX, layer.y + layer.offsetY)
    })
  }

  /**
   * 根据id获取图层
   */
  getLayerById (layerId:string):Layer|undefined {
    return this.layers.find(({ id }) => id === layerId)
  }

  /**
   *  根据偏移量移动图层
   */
  moveLayerById (point:point, layerId:string):void {
    const layer = this.getLayerById(layerId)
    if (this.layers[0].id === layerId) {
      return null
    }
    if (layer) {
      layer.offsetX = point.x
      layer.offsetY = point.y
      this.reDraw()
      this.ctx.strokeStyle = 'red'
      this.ctx.lineWidth = 6
      this.ctx.strokeRect(layer.x + layer.offsetX, layer.y + layer.offsetY, layer.width, layer.height)
    }
  }

  // 移动完成
  moveLayerEndById (layerId:string):void {
    const layer = this.getLayerById(layerId)
    layer.polylinePoints = getLayerPolygonByOffset(layer, layer.offsetX, layer.offsetY)
    if (layer) {
      layer.x = layer.x + layer.offsetX
      layer.y = layer.y + layer.offsetY
      layer.offsetX = 0
      layer.offsetY = 0
    }
    this.reDraw()
  }

  sortLayer (idList:string):void {
    this.layers = this.layers.sort((a, b) => idList.indexOf(b.id) - idList.indexOf(a.id))
    this.reDraw()
  }

  delLayerById (layerId:string):void {
    this.layers = this.layers.filter(layer => layer.id !== layerId)
    this.reDraw()
  }

  addLayerImg (img:MyImage):void {
    this.layers.push(new Layer(img))
    this.reDraw()
  }
}
