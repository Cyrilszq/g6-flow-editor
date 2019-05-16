import G6 from '@antv/g6'
import uuid from 'uuid'

// 定义拖动节点到画布
G6.registerBehavior('drag-node-to-editor', {
  getEvents() {
    return {
      'canvas:mouseenter': 'onMouseenter',
      'canvas:mousemove': 'onMousemove',
      'canvas:mouseup': 'stopAdd',
      'canvas:mouseleave': 'cancelAdd',
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
  stopAdd(ev) {
    const { x, y } = ev
    const node = this.graph.get('addNode')
    if (this.delegateShape && node) {
      this.graph.add('node', {
        id: uuid(),
        isAnchorShow: true,
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
      });
      this.delegateShape.remove()
      this.delegateShape = undefined
      this.graph.set('addNode', undefined)
      this.graph.paint()
    }
  },
  cancelAdd() {
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
})