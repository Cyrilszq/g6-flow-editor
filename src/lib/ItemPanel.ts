import { getGraph } from "./Editor";

class ItemPanel {
  _cfg: any;
  constructor(cfg) {
    this._cfg = cfg
    this.bindEvent()
  }

  bindEvent() {
    const { items, container } = this._cfg
    const graph = getGraph()
    const containerEle = document.querySelector(`#${container}`)!
    containerEle.addEventListener('mousedown', (e) => {
      const target = e.target as Element
      const type = target.getAttribute('data-type')
      graph.set('addNode', items.find(item => item.type === type))
    })
  }
}

export default ItemPanel