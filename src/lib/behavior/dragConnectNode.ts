import G6 from '@antv/g6'

// 定义连接两个锚点
G6.registerBehavior('drag-connect-node', {
  getDefaultCfg() {
    return {
      delegateEdgeStyle: {
        stroke: '#1890FF',
        lineDash: [ 4, 4 ],
        lineWidth: 1
      },
      edgeStyle: {
        lineDash: [],
        stroke: '#A3B1BF',
        strokeOpacity: 0.92,
        lineWidth: 1,
        lineAppendWidth: 8,
        endArrow: true
      },
    }
  },
  getEvents() {
   return {
    'anchor:mousedown': 'startAddEdge', 
    'anchor:mouseenter': 'onMouseenter', 
    'anchor:mouseleave': 'onMouseleave', 
    'mousemove': 'onMousemove',
    'mouseup': 'onMouseup'
   };
  },
  // 鼠标按下
  startAddEdge(ev) {
    // this.graph.removeBehaviors('click-select-edge', 'default')
    const id = ev.target.get('id')
    if (!this.addingEdge) {
      this.edge = this.graph.addItem('edge', {
        shape: 'flow-cubic-vertical',
        style: this.delegateEdgeStyle,
        source: id,
        sourceAnchor: ev.target.get('index'),
        target: { x: ev.target.get('x'), y: ev.target.get('y') },
      })
      this.addingEdge = true
    }
  },
  // 鼠标滑入锚点
  onMouseenter(ev) {
    // 设置目标节点id
    if (this.addingEdge && this.edge) {
      const id = ev.target.get('id')
      this.targetId = id
    } else {
      this.targetId = false
    }
  },
  // 鼠标滑出锚点时清空目标节点id
  onMouseleave(ev) {
    this.targetId = false
  },
  // 移动鼠标，跟着画线
  onMousemove(ev) {
    const point = { x: ev.x, y: ev.y }
    if (this.addingEdge && this.edge) {
      // 增加边的过程中，移动时边跟着移动
      this.graph.updateItem(this.edge, {
        target: point
      })
    }
  },
  // 抬起鼠标，结束绘制，如果在锚点则进行连线
  onMouseup(ev) {
    if (this.addingEdge && this.edge) {
      if (this.targetId) {
        this.graph.updateItem(this.edge, {
          style: this.edgeStyle,
          target: this.targetId,
          targetAnchor: ev.target.get('index'),
        });
        this.edge = null
        this.addingEdge = false
      } else {
        this.graph.removeItem(this.edge)
        this.edge = null
        this.addingEdge = false
      }
    }
  }
})