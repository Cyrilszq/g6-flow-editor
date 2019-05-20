import { getGraph } from "./Editor";

export type ItemType = {
  type: string,
  width: number,
  height: number,
  label: string,
  shape: string,
}

class ItemPanel {
  private cfg: {
    container: string,
    items: ItemType[]
  };
  constructor(cfg) {
    this.cfg = cfg
    this.bindEvent()
  }

  private bindEvent(): void {
    const { items, container } = this.cfg
    const graph = getGraph()
    const containerElement = document.querySelector(`#${container}`)!
    containerElement.addEventListener('mousedown', (e) => {
      const target = <Element>e.target
      const type = target.getAttribute('data-type')
      graph.emit('flow:addnode', items.find(item => item.type === type))
    })
  }
}

export default ItemPanel