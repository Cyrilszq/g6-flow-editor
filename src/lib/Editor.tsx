import G6 from '@antv/g6'
import Anchor from './Anchor'
import './behavior'

let graph: any = null

class Editor {
  _cfg: any;
  anchor: Anchor;

  constructor(cfg) {
    this._cfg = cfg
    this.init()
    this.anchor = new Anchor()
  }

  private init(): void {
    if (!graph) {
      const { container, width, height } = this._cfg
      const containerEle = document.querySelector(`#${container}`) as Element
      const { width: containerWidth, height: containerHeight } = containerEle.getBoundingClientRect()
      // 初始化Graph
      graph = new G6.Graph({
        container,
        width: width || containerWidth,
        height: height || containerHeight,
        modes: {
          default: ['zoom-canvas', 'drag-node', 'click-select', 'drag-node-to-editor', 'drag-connect-node']
        }
      })
    }
    this.bindEvent()
  }

  private bindEvent(): void {
    // 添加节点时额外为节点画锚点
    graph.on('aftereadditem', (ev) => {
      ev.model.isAnchorShow && this.anchor.drawAnchor(ev.model)
    })
    // 在节点拖动结束时更新锚点位置
    graph.on('node:dragend', (ev) => {
      this.anchor.updateAnchor(ev.item.get('model'))
    })
  }
}

export const getGraph = () => graph

export default Editor
