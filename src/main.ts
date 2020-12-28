import PhotoShop from './modules'
import Dom from './modules/dom'
import './style/index.css'
import './style/reset.css'
const ps = new PhotoShop()

declare class Gcss {
  constructor (options:unknown)
  start():void
}

const app = document.getElementById('app')
Dom.mount(app)

const addImg = document.createElement('button')
addImg.textContent = 'add image'
Dom.top.append(addImg)

new Gcss({
  colors    : { },
  unit      : 'px',
  important : false,
}).start()
