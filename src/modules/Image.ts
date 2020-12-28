export class MyImage {
  public fileName: string;
  public image: HTMLImageElement | null;
  constructor (fileName: string, image?: HTMLImageElement) {
    this.fileName = fileName
    this.image = image ?? null
  }

  setImage (image:HTMLImageElement):void {
    this.image = image
  }
}
