import { MyImage } from './Image'

export default class FiltUtil {
  file:File;
  constructor (file:File) {
    this.file = file
  }

  convertFileToImg ():Promise<MyImage> {
    return new Promise((resolve) => {
      const reader = new FileReader()
      const img = new Image()
      reader.readAsDataURL(this.file)
      reader.onloadend = ({ target }) => {
        img.src = target.result as string
      }

      img.onload = () => {
        resolve(new MyImage(this.file.name, img))
      }
    })
  }
}
