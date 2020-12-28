import PhotoShop from './index'
import Flatten from '@flatten-js/core'

enum ActionTypes { move, scale }

export class Actions {
  private currentAction:ActionTypes|null
  private ps:PhotoShop|null
  /**
   * 当前操作layer的id
   */
  private chooseLayerId:string|null
  constructor (ps:PhotoShop) {
    this.currentAction = ActionTypes.move
    this.ps = ps
    this.chooseLayerId = null
  }

  public getCurrentAction (): ActionTypes {
    return this.currentAction
  }

  public setCurrentAction (currentAction: ActionTypes): void {
    this.currentAction = currentAction
  }

  /**
   * 移动元素
   */
  public move ():void {
    const canvas = this.ps.getCanvas()
    let start = [0, 0]
    this.currentAction = ActionTypes.move
    const mouseUp = () => {
      this.ps.getCanvas().style.cursor = 'default'
      canvas.removeEventListener('mousemove', mouseMove)
      this.ps.moveLayerEndById(this.chooseLayerId)
      start = [0, 0]
    }

    const mouseMove = (event: MouseEvent) => {
      const { offsetX:x, offsetY:y } = event
      const [startX, startY] = start
      const move = new Flatten.Vector(x - startX, y - startY)
      this.ps.moveLayerById(move, this.chooseLayerId)
    }

    const mouseDown = (event:MouseEvent) => {
      const { offsetX, offsetY } = event
      start = [offsetX, offsetY]
      const idList = this.ps.getLayersIdByPoint(new Flatten.Point(offsetX, offsetY))
      if (idList.length) {
        this.ps.getCanvas().style.cursor = 'move'
        this.chooseLayerId = idList[0]
        this.ps.chooseLayerById(this.chooseLayerId)
        canvas.addEventListener('mousemove', mouseMove)
        canvas.addEventListener('mouseup', mouseUp)
      }
    }

    canvas.removeEventListener('mousemove', mouseMove)
    canvas.removeEventListener('mouseup', mouseUp)
    canvas.removeEventListener('mousedown', mouseDown)
    canvas.addEventListener('mousedown', mouseDown)
  }

  public scale ():void {
    const start = new Flatten.Vector(0, 0)
    const canvas = this.ps.getCanvas()
  }
}
