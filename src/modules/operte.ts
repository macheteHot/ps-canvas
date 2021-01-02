import Flatten from '@flatten-js/core'

export class Operte {
  private area:Flatten.Circle|Flatten.Box
  private cursor:string
  private layerId:string

  constructor (area:Flatten.Circle | Flatten.Box, cursor:string, layerId:string) {
    this.area = area
    this.cursor = cursor
    this.layerId = layerId
  }

  public mousein (canvas:HTMLCanvasElement):void {
    canvas.style.cursor = this.cursor
  }

  public contains (point:Flatten.Point):boolean {
    if (this.area instanceof Flatten.Circle) {
      return this.area.contains(point)
    } else if (this.area instanceof Flatten.Box) {
      return new Flatten.Polygon(this.area).contains(point)
    }
    return false
  }

  public getCursor (): string {
    return this.cursor
  }

  public setCursor (cursor: string): void {
    this.cursor = cursor
  }

  public getArea (): Flatten.Circle|Flatten.Box {
    return this.area
  }

  public setArea (area: Flatten.Circle|Flatten.Box): void {
    this.area = area
  }

  public getLayerId (): string {
    return this.layerId
  }

  public setLayerId (layerId: string): void {
    this.layerId = layerId
  }
}
