import G6 from '@antv/g6'

// 点击选中边
G6.registerBehavior('click-select-edge', {
  getDefaultCfg() {
    return {
    }
  },
  getEvents() {
   return {
    'edge:click': 'onClickEdge', 
    'canvas:click': 'clearSelect', 
    'edge:mouseenter': 'hoverEdge', 
    'edge:mouseleave': 'leaveEdge',
   };
  },
  onClickEdge(ev) {
    const edge = ev.item;
    this.clearSelect()
    this.graph.setItemState(edge, 'selected', !edge.hasState('selected')); // 切换选中
  },
  clearSelect(ev) {
    this.graph.findAllByState('edge', 'selected').forEach(edge => this.graph.setItemState(edge, 'selected', false))
  },
  hoverEdge(ev) {
    const edge = ev.item;
    this.graph.setItemState(edge, 'active', true);
  },
  leaveEdge(ev) {
    const edge = ev.item;
    !edge.hasState('selected') && this.graph.setItemState(edge, 'active', false);
  },
})