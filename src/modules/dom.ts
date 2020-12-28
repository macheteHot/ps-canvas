
const Dom = {
  top       : document.createElement('div'),
  rightBox  : document.createElement('div'),
  leftBox   : document.createElement('div'),
  canvas    : document.createElement('canvas'),
  layersBox : document.createElement('div'),
  canvasBox : document.createElement('div'),
  mount (el:HTMLElement):void {
    el.append(Dom.top, Dom.leftBox, Dom.rightBox, Dom.canvasBox)
  },
}

Dom.top.classList.add('ps-top')
Dom.rightBox.classList.add('ps-rightBox')
Dom.leftBox.classList.add('ps-leftBox')
Dom.rightBox.append(Dom.layersBox)
Dom.canvasBox.append(Dom.canvas)
Dom.canvasBox.classList.add('ps-canvasBox')

export default Dom
