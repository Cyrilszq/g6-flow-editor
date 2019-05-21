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
    'mouseenter': 'handleHoverAnchor',
    'mousedown': 'handleStartAddEdge',
    'mousemove': 'handleUpdateEdge',
    'mouseleave': 'handleMouseleave',
    'mouseup': 'handleStopAddEdge'
   };
  },
  handleHoverAnchor(ev) {
    const anchor = ev.target
    if (anchor.get('name') !== 'anchor') return
    if (this.selectedAchor && this.addingEdge) {
      const id = anchor.get('id')
      this.targetId = id
    } else {
      this.setAchorActive(anchor)
      this.targetId = false
    }
  },
  // 鼠标按下
  handleStartAddEdge(ev) {
    const anchor = ev.target
    if (anchor.get('name') !== 'anchor') return
    if (!this.selectedAchor) {
      this.addingEdge = this.graph.addItem('edge', {
        shape: 'flow-cubic-vertical',
        style: this.delegateEdgeStyle,
        source: anchor.get('id'),
        sourceAnchor: anchor.get('index'),
        target: { x: anchor.get('x'), y: anchor.get('y') },
      })
      this.selectedAchor = anchor
    }
  },
  // 移动鼠标，跟着画线
  handleUpdateEdge(ev) {
    const point = { x: ev.x, y: ev.y }
    if (this.selectedAchor && this.addingEdge) {
      // 增加边的过程中，移动时边跟着移动
      this.graph.updateItem(this.addingEdge, {
        target: point
      })
    }
  },
  // 鼠标滑出锚点时清空目标节点id
  handleMouseleave(ev) {
    const anchor = ev.target
    if (anchor.get('name') !== 'anchor') return
    if (!this.selectedAchor) {
      this.resetAchor(anchor)
    }
    this.targetId = false
  },
  // 抬起鼠标，结束绘制，如果在锚点则进行连线
  handleStopAddEdge(ev) {
    if (!this.selectedAchor) return
    this.resetAchor(this.selectedAchor)
    if (this.targetId) {
      this.graph.updateItem(this.addingEdge, {
        style: this.edgeStyle,
        target: this.targetId,
        targetAnchor: ev.target.get('index'),
      })
    } else {
      this.graph.removeItem(this.addingEdge)
    }
    this.selectedAchor = null
    this.addingEdge = null
  },
  setAchorActive(anchor) {
    anchor.attr({
      radius: 4,
      fill: '#1890FF',
      stroke: '#1890FF'
    })
    this.graph.paint()
  },
  resetAchor(anchor) {
    anchor.attr({
      radius: 3.5,
      fill: '#fff',
    })
    this.graph.paint()
  },
})