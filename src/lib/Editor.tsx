import G6 from '@antv/g6'
import './registerEdge'
import './behavior'


let graph: any

class Editor {
  private cfg: {
    width?: number,
    height?: number,
    container: string,
    graphCfg: any,
  };

  constructor(cfg) {
    this.cfg = cfg
    this.init()
  }

  private init(): void {
    if (!graph) {
      const { container, width, height } = this.cfg
      const containerElement = document.querySelector(`#${container}`) as Element
      const { width: containerWidth, height: containerHeight } = containerElement.getBoundingClientRect()
      // 初始化Graph
      graph = new G6.Graph({
        container,
        width: width || containerWidth,
        height: height || containerHeight,
        modes: {
          default: [
            'zoom-canvas',
            'drag-node',
            'click-select',
            'drag-node-to-editor',
            'drag-connect-node',
            'click-select-edge',
            'auto-add-anchor',
          ]
        },
        ...(this.cfg.graphCfg || {}),
      })
    }
    this.bindEvent()
  }

  private bindEvent(): void {
  }
}

export const getGraph = () => graph

export default Editor
