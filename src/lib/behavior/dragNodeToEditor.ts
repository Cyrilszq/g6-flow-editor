import G6 from '@antv/g6'
import uuid from 'uuid'
import Anchor from '../Anchor';

const anchor = new Anchor()

// 定义拖动节点到画布，包含锚点行为
G6.registerBehavior('drag-node-to-editor', {
  getEvents() {
    return {
      // 移入 canvas，创建一个代理矩形
      'canvas:mouseenter': 'onMouseenter',
      // 更新代理矩形位置
      'canvas:mousemove': 'onMousemove',
      // 移除代理矩形，新增配置节点
      'canvas:mouseup': 'onMouseup',
      // 移除canvas，移除代理矩形
      'canvas:mouseleave': 'onMouseleave',
      'afteritemupdate': 'onUpdateAnchor',
      'beforeremoveitem': 'onClearAnchor',
    };
  },
  onMouseenter(ev) {
    const node = this.graph.get('addNode')
    const { x, y } = ev
    if (!this.delegateShape && node) {
      const { width, height } = node
      const parent = this.graph.get('group')
      this.delegateShape = parent.addShape('rect', {
        attrs: {
          width,
          height,
          x: x - width / 2,
          y: y - height / 2,
          fill: '#F3F9FF',
          fillOpacity: 0.5,
          stroke: '#1890FF',
          strokeOpacity: 0.9,
          lineDash: [ 5, 5 ]
        },
      })
      this.delegateShape.set('capture', false)
    }
  },
  onMouseup(ev) {
    const { x, y } = ev
    const node = this.graph.get('addNode')
    if (this.delegateShape && node) {
      const model = {
        id: uuid(),
        isShowAnchor: true,
        x,
        y,
        size: [node.width, node.height],
        ...node,
        style: {
          stroke: '#CED4D9',
          shadowOffsetX: 0,
          shadowOffsetY: 4,
          shadowBlur: 10,
          shadowColor: 'rgba(13, 26, 38, 0.08)',
          lineWidth: 1,
          radius: 4,
          fillOpacity: 0.92
        },
        anchorPoints: [[0.5, 1], [ 0.5, 0], [0, 0.5], [1, 0.5]]
      }
      this.graph.add('node', model);
      this.delegateShape.remove()
      this.delegateShape = undefined
      this.graph.set('addNode', undefined)
      this.graph.paint()
      anchor.drawAnchor(model)
    }
  },
  onMouseleave() {
    const node = this.graph.get('addNode')
    if (this.delegateShape && node) {
      this.delegateShape.remove()
      this.delegateShape = undefined
      this.graph.set('addNode', undefined)
      this.graph.paint()
    }
  },
  onMousemove(ev) {
    const { x, y } = ev
    const node = this.graph.get('addNode')
    if (this.delegateShape && node) {
      const { width, height } = node
      this.delegateShape.attr({ x: x - width / 2, y: y - height / 2 });
      this.graph.paint();
    }
  },
  onClearAnchor(ev) {
    anchor.clearAnchor(ev.item.get('model'))
  },
  onUpdateAnchor(ev) {
    const model = ev.item.get('model')
    if (model.isShowAnchor) {
      anchor.updateAnchor(model)
    }
  },
})