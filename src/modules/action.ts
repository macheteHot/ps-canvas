import PhotoShop from './index'
import Flatten from '@flatten-js/core'
import { ActionTypes } from '../Interface'

export class Actions {
  private ps:PhotoShop|null
  private startPoint:Flatten.Point
  /**
   * 当前操作layer的id
   */
  private chooseLayerId:string|null
  constructor (ps:PhotoShop) {
    ps.setCurrentAction(null)
    this.ps = ps
    this.chooseLayerId = null
    // 添加默认鼠标事件
    ps.getCanvas().addEventListener('mousemove', this.setCursor)
  }

  public getStartPoint (): Flatten.Point {
    return this.startPoint
  }

  public setStartPoint (x:number, y:number): void {
    this.startPoint = new Flatten.Point(x, y)
  }

  private handleMouseUp = () => {
    this.ps.getCanvas().style.cursor = 'default'
    // this.ps.getCanvas().removeEventListener('mousemove', mouseMove)
    this.ps.moveLayerEndById(this.chooseLayerId)
    this.setStartPoint(0, 0)
    this.ps.getCanvas().removeEventListener('mousemove', this.handleMouseMove)
    this.ps.getCanvas().removeEventListener('mouseup', this.handleMouseUp)
    this.ps.getCanvas().removeEventListener('mouseout', this.handleMouseUp)
  }

  private handleMouseDown = (event:MouseEvent) => {
    const { offsetX, offsetY } = event
    const canvas = this.ps.getCanvas()
    this.setStartPoint(offsetX, offsetY)
    const currentAction = this.ps.getCurrentAction()
    if (currentAction === ActionTypes.move) {
      const idList = this.ps.getLayersIdByPoint(new Flatten.Point(offsetX, offsetY))
      if (idList.length) {
        this.chooseLayerId = idList[0]
        this.ps.chooseLayerById(this.chooseLayerId)
        canvas.addEventListener('mousemove', this.handleMouseMove)
        canvas.addEventListener('mouseup', this.handleMouseUp)
      }
    }

    if (currentAction === ActionTypes.scale) {
      // todo scale
    }
    if (currentAction === ActionTypes.rotate) {
      // todo rotate
    }

    this.ps.getCanvas().addEventListener('mousemove', this.handleMouseMove)
    this.ps.getCanvas().addEventListener('mouseup', this.handleMouseUp)
    this.ps.getCanvas().addEventListener('mouseout', this.handleMouseUp)
  }

  private handleMouseMove = (event:MouseEvent) => {
    const currentAction = this.ps.getCurrentAction()
    if (currentAction === ActionTypes.move) {
      const movePoint = Flatten.point(event.offsetX, event.offsetY)
      this.ps.moveLayerById(new Flatten.Vector(this.startPoint, movePoint), this.chooseLayerId)
    }
    if (currentAction === ActionTypes.scale) {
      // todo scale
    }
    if (currentAction === ActionTypes.rotate) {
      // todo rotate
    }
    // this.ps.moveLayerById(new Flatten.Vector(this.startPoint, movePoint), this.chooseLayerId)
  }

  /**
   * start action event
   */
  public start ():void {
    this.ps.getCanvas().addEventListener('mousedown', this.handleMouseDown)
  }

  /**
   * set action type
   */
  public setType (type:ActionTypes):void {
    this.ps.setCurrentAction(type)
  }

  /**
   * stop action event
   */
  public end ():void {
    this.ps.getCanvas().removeEventListener('mousedown', this.handleMouseDown)
  }

  /**
   * set Cursor event
   */
  public setCursor = (event:MouseEvent):void => {
    const { offsetX, offsetY } = event
    const canvas = this.ps.getCanvas()
    const layers = this.ps.getLayers()
    const operElement = this.ps.getOperElement()
    const point = Flatten.point(offsetX, offsetY)
    layers.forEach(layer => {
      if (layer.geometry.value.contains(point)) {
        layer.mousein(canvas, this.ps.getCurrentAction())
      }
    })
    operElement.forEach(ele => {
      if (ele.contains(point)) {
        ele.mousein(canvas)
      }
    })
  }

  public scale = ():void => {
    const operElement = this.ps.getOperElement()
    this.ps.setCurrentAction(ActionTypes.scale)
    let start = [0, 0]
    const canvas = this.ps.getCanvas()

    const handleMouseup = ():void => {
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('mouseup', handleMouseup)
      canvas.removeEventListener('mouseout', handleMouseup)
    }

    const handleMouseMove = (event:MouseEvent):void => {
      const { offsetX, offsetY } = event
      const angle = new Flatten.Vector(...start).angleTo(new Flatten.Vector(offsetX, offsetY))
      this.ps.roateLayerById(this.chooseLayerId, angle)
    }

    const handleMouseDown = (event:MouseEvent):void => {
      const { offsetX, offsetY } = event
      // get opert element
      for (let i = 0; i < operElement.length; i++) {
        if (operElement[i].contains(Flatten.point(offsetX, offsetY))) {
          start = [offsetX, offsetY]
          break
        }
      }
      canvas.addEventListener('mousemove', handleMouseMove)
    }
    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('mouseup', handleMouseup)
    canvas.addEventListener('mouseout', handleMouseup)
  }
}
