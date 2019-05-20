import G6 from '@antv/g6'
import uuid from 'uuid'
import { ItemType } from '../ItemPanel';

// 定义拖动节点到画布
G6.registerBehavior('drag-node-to-editor', {
  getDefaultCfg() {
    return {
      delegateShapeStyle: {
        fill: '#F3F9FF',
        fillOpacity: 0.5,
        stroke: '#1890FF',
        strokeOpacity: 0.9,
        lineDash: [ 5, 5 ]
      },
      defaultNodeStyle: {
        stroke: '#CED4D9',
        shadowOffsetX: 0,
        shadowOffsetY: 4,
        shadowBlur: 10,
        shadowColor: 'rgba(13, 26, 38, 0.08)',
        lineWidth: 1,
        radius: 4,
        fillOpacity: 0.92
      }
    }
  },
  getEvents() {
    return {
      'flow:addnode': 'startAddNode',
      // 移入 canvas，创建一个代理矩形
      'canvas:mouseenter': 'onMouseenter',
      // 更新代理矩形位置
      'canvas:mousemove': 'onMousemove',
      // 移除代理矩形，新增配置节点
      'canvas:mouseup': 'onMouseup',
      // 移除canvas，移除代理矩形
      'canvas:mouseleave': 'onMouseleave',
    };
  },
  // 开始添加
  startAddNode(node: ItemType) {
    this.addingNode = node
  },
  onMouseenter(ev) {
    const { x, y } = ev
    if (!this.delegateShape && this.addingNode) {
      const { width, height } = this.addingNode
      const parent = this.graph.get('group')
      this.delegateShape = parent.addShape('rect', {
        attrs: {
          width,
          height,
          x: x - width / 2,
          y: y - height / 2,
          ...this.delegateShapeStyle,
        },
      })
      this.delegateShape.set('capture', false)
    }
  },
  onMousemove(ev) {
    const { x, y } = ev
    if (this.delegateShape && this.addingNode) {
      const { width, height } = this.addingNode
      this.delegateShape.attr({ x: x - width / 2, y: y - height / 2 });
      this.graph.paint();
    }
  },
  onMouseup(ev) {
    const { x, y } = ev
    if (this.delegateShape && this.addingNode) {
      const model = {
        id: uuid(),
        isShowAnchor: true,
        x,
        y,
        size: [this.addingNode.width, this.addingNode.height],
        style: this.defaultNodeStyle,
        anchorPoints: [[0.5, 0]],
        ...this.addingNode,
      }
      this.graph.add('node', model);
      this.delegateShape.remove()
      this.delegateShape = undefined
      this.addingNode = undefined
      this.graph.paint()
    }
  },
  onMouseleave() {
    if (this.delegateShape && this.addingNode) {
      this.delegateShape.remove()
      this.delegateShape = undefined
      this.addingNode = undefined
      this.graph.paint()
    }
  },
  // onClearAnchor(ev) {
  //   anchor.clearAnchorById(ev.item.get('model').id)
  // },
  // onUpdateAnchor(ev) {
  //   const model = ev.item.get('model')
  //   if (model.isShowAnchor) {
  //     anchor.updateAnchor(model)
  //   }
  // },
})