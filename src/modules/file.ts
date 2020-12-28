import { MyImage } from './Image'

export default class FiltUtil {
  file:File;
  constructor (file:File) {
    this.file = file
  }

  convertFileToImg ():Promise<MyImage> {
    return new Promise((resolve) => {
      const img = new MyImage()
      const reader = new FileReader()
      reader.readAsDataURL(this.file)
      reader.onloadend = ({ target }) => {
        img.src = target.result as string
        img.fileName = this.file.name
      }
      img.onload = () => {
        resolve(img)
      }
    })
  }
}
