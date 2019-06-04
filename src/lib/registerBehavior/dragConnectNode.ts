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
      shouldBegin(anchor, graph) {
        const { type } = anchor.get('anchorCfg')
        const { edges = [] } = graph.save()
        // 鼠标移动到 type 为 out 的锚点 && 该锚点没有连接过 才可以开始连线
        return type === 'out' && !edges.find((item) => item.source === anchor.get('id') && item.sourceAnchor === anchor.get('index'))
      },
      shouldEnd(anchor) {
        const { type } = anchor.get('anchorCfg')
        return type === 'in'
      }
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
      this.targetAnchor = anchor
    } else if (this.shouldBegin(anchor, this.graph)) {
      this.setAchorHover(anchor)
      this.targetAnchor = null
    }
  },
  // 鼠标按下
  handleStartAddEdge(ev) {
    const anchor = ev.target
    if (anchor.get('name') !== 'anchor') return
    if (!this.selectedAchor && this.shouldBegin(anchor, this.graph)) {
      this.addingEdge = this.graph.addItem('edge', {
        shape: 'flow-cubic-vertical',
        style: this.delegateEdgeStyle,
        source: anchor.get('id'),
        sourceAnchor: anchor.get('index'),
        target: { x: anchor.get('x'), y: anchor.get('y') },
      })
      this.selectedAchor = anchor
      this.setAchorActive()
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
    this.targetAnchor = null
  },
  // 抬起鼠标，结束绘制，如果在锚点则进行连线
  handleStopAddEdge(ev) {
    if (!this.selectedAchor) return
    this.resetAchor(this.selectedAchor)
    if (this.targetAnchor && this.shouldEnd(this.targetAnchor)) {
      this.graph.updateItem(this.addingEdge, {
        style: this.edgeStyle,
        target: this.targetAnchor.get('id'),
        targetAnchor: ev.target.get('index'),
      })
    } else {
      this.graph.removeItem(this.addingEdge)
    }
    this.selectedAchor = null
    this.addingEdge = null
  },
  // 锚点hover样式
  setAchorHover(anchor) {
    anchor.attr({
      radius: 4,
      fill: '#1890FF',
      stroke: '#1890FF'
    })
    this.graph.paint()
  },
  // 锚点可被链接样式
  setAchorActive() {
  },
  // 锚点样式重置
  resetAchor(anchor) {
    anchor.attr({
      radius: 3.5,
      fill: '#fff',
      fillOpacity: 1,
    })
    this.graph.paint()
  },
})