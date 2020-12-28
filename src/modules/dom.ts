interface attribute { [key: string]: string }
type classList = string[] | string

function factory<T extends keyof HTMLElementTagNameMap> (type:T, classList?:classList, attributes?:attribute):HTMLElementTagNameMap[T] {
  classList = classList ?? ''
  attributes = attributes ?? {}
  const dom = document.createElement(type)
  Object.entries(attributes).forEach(([key, value]) => {
    dom.setAttribute(key, value as string)
  })
  if (Array.isArray(classList)) {
    dom.classList.add(...classList as string[])
  } else {
    dom.className = classList as string
  }
  return dom
}
function factoryIcon (...name:string[]):HTMLElement {
  const icon = factory('i')
  icon.classList.add('iconfont', ...name)
  return icon
}
const Dom = {
  top       : factory('div', 'ps-top bg-secondary bg-gradient'),
  rightBox  : factory('div', 'ps-rightBox'),
  leftBox   : factory('div', 'ps-leftBox'),
  canvas    : factory('canvas'),
  layersBox : factory('div'),
  canvasBox : factory('div'),
  mount (el:HTMLElement):void {
    el.append(Dom.top, Dom.leftBox, Dom.rightBox, Dom.canvasBox)
  },
  factory,
  factoryIcon,
}

Dom.rightBox.append(Dom.layersBox)
Dom.canvasBox.append(Dom.canvas)
Dom.canvasBox.classList.add('ps-canvasBox')

export default Dom
