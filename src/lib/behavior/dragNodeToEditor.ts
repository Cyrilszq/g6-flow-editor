import G6 from '@antv/g6'
import uuid from 'uuid'

// 定义拖动节点到画布
G6.registerBehavior('drag-node-to-editor', {
  getEvents() {
    return {
      'canvas:mouseenter': 'onMouseenter',
      'canvas:mousemove': 'onMousemove',
      'canvas:mouseup': 'stopAdd',
      'canvas:mouseleave': 'stopAdd',
    };
  },
  onMouseenter(ev) {
    let shape = this.graph.get('delegateShape')
    const node = this.graph.get('addNode')
    const { x, y } = ev
    if (!shape && node) {
      const { width, height } = node
      const parent = this.graph.get('group');
      shape = parent.addShape('rect', {
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
      });
      shape.set('capture', false);
      this.graph.set('delegateShape', shape);
    }
  },
  stopAdd(ev) {
    const { x, y } = ev
    const shape = this.graph.get('delegateShape');
    const node = this.graph.get('addNode')
    if (shape && node) {
      this.graph.add('node', {
        id: uuid(),
        isAnchorShow: true,
        x,
        y,
        size: [node.width, node.height],
        ...node,
        anchorPoints: [[0.5, 1], [ 0.5, 0]]
      });
      shape.remove()
      this.graph.set('delegateShape', undefined);
      this.graph.set('addNode', undefined)
      this.graph.paint();
    }
  },
  onMousemove(ev) {
    const { x, y } = ev
    const node = this.graph.get('addNode')
    let shape = this.graph.get('delegateShape');
    if (shape && node) {
      const { width, height } = node
      shape.attr({ x: x - width / 2, y: y - height / 2 });
      this.graph.paint();
    }
  },
})