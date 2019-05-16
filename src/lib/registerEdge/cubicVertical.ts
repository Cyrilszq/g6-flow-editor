import G6 from '@antv/g6'

// 继承 cubic-vertical 做边选中样式调整
G6.registerEdge('flow-cubic-vertical', {
  // 设置状态
  setState(name, value, item) {
    const group = item.getContainer();
    const shape = group.get('children')[0]; // 顺序根据 draw 时确定
    if(name === 'active') {
      if(value) {
        shape.attr({
          stroke: '#1890FF',
          strokeOpacity: 0.7,
          lineWidth: 2
        });
      } else {
        shape.attr({
          stroke: '#A3B1BF',
          lineWidth: 1,
        });
      }
    }
    if (name === 'selected') {
      if(value) {
        shape.attr({
          stroke: '#1890FF',
          strokeOpacity: 1,
          lineWidth: 2
        });
      } else {
        shape.attr({
          stroke: '#A3B1BF',
          lineWidth: 1,
        })
      }
    }
  }
}, 'cubic-vertical')
