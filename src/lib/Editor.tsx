import G6 from '@antv/g6'
import Anchor from './Anchor'
import './registerEdge'
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
    graph.on('aftereadditem' /** 此处G6接口名称存在拼写错误，已提交PR */, (ev) => {
      ev.model.isAnchorShow && this.anchor.drawAnchor(ev.model)
    })

    graph.on('beforeremoveitem', (ev) => {
      this.anchor.clearAnchor(ev.item.get('model'))
    })

    // 在节点拖动结束时更新锚点位置
    graph.on('node:dragend', (ev) => {
      this.anchor.updateAnchor(ev.item.get('model'))
    })
    // 点击时选中，再点击时取消
    graph.on('edge:click', (ev) => {
      const edge = ev.item;
      graph.setItemState(edge, 'selected', !edge.hasState('selected')); // 切换选中
    });

    graph.on('canvas:click', (ev) => {
      this.getSelectedEdges().forEach(edge => graph.setItemState(edge, 'selected', false))
    });

    graph.on('edge:mouseenter' ,(ev) => {
      const edge = ev.item;
      graph.setItemState(edge, 'active', true);
    });

    graph.on('edge:mouseleave' , (ev) => {
      const edge = ev.item;
      !edge.hasState('selected') && graph.setItemState(edge, 'active', false);
    });

    graph.on('keyup', (ev) => {
      // 删除
      if (ev.keyCode === 8) {
        this.getSelectedNodes().forEach(shape => graph.remove(shape))
        this.getSelectedEdges().forEach(shape => graph.remove(shape))
      }
    })
  }

  getSelectedEdges(): Array<any> {
    return graph.getEdges().filter(edge => edge.hasState('selected'))
  }

  getSelectedNodes(): Array<any> {
    return graph.getNodes().filter(node => node.hasState('selected'))
  }
}

export const getGraph = () => graph

export default Editor
