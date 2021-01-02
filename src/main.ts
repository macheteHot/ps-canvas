import PhotoShop from './modules'
import Dom from './modules/dom'
import FiltUtil from './modules/file'
import { Actions } from './modules/action'

import './style/index.less'
import './style/reset.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { ActionTypes } from './Interface'

const ps = new PhotoShop()
const actions = new Actions(ps)
declare class Gcss {
  constructor (options:unknown)
  start():void
}

const app = document.getElementById('app')
Dom.mount(app)
// 添加图片事件 start
const inputFile = Dom.factory('input', '', { type: 'file', accept: 'image/*' })
const addImg = Dom.factory('button', ['btn', 'btn-primary', 'btn-sm'], { type: 'button' })
async function addLayer (event: Event) {
  if ((event.target as HTMLInputElement).files && (event.target as HTMLInputElement).files.length) {
    const fileUtil = new FiltUtil((event.target as HTMLInputElement).files[0])
    const img = await fileUtil.convertFileToImg()
    ps.addLayerImg(img)
  }
}
inputFile.addEventListener('change', addLayer)
addImg.addEventListener('click', () => { inputFile.click() })
addImg.textContent = 'add image'
Dom.top.append(addImg)
// 添加图片事件 end

// 添加指针移动工具 start
const moveIcon = Dom.factoryIcon('iconzhizhen', 'bg-gradient-primary')
moveIcon.addEventListener('click', () => { actions.setType(ActionTypes.move) })
Dom.leftBox.append(moveIcon)
// 添加指针移动工具 end

// 添加缩放工具 start
const scaleIcon = Dom.factoryIcon('iconsuofang', 'bg-gradient-primary')
scaleIcon.addEventListener('click', actions.scale)
Dom.leftBox.append(scaleIcon)

// start action

actions.start()

new Gcss({
  colors    : { },
  unit      : 'px',
  important : false,
}).start()
