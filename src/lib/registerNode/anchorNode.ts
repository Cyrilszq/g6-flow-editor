import G6 from '@antv/g6'
import { defaultAnchorStyle } from '../global';

// 继承 node，新增画锚点
G6.registerNode('anchor-node', {
  // 绘制后附加锚点
  afterDraw(cfg, group) {
    const { anchorPoints, width, height, id } = cfg
    anchorPoints.forEach((points, index) => {
      const [x, y, anchorCfg] = points
      // 把原点置为图形左上角
      const originX = -width / 2
      const originY = -height / 2
      const anchorPointX = x * width + originX
      const anchorPointY = y * height + originY
      const anchor = group.addShape('marker', {
        // 临时解决无法监听 anchor 事件的问题
        name: 'anchor',
        anchorCfg,
        id,
        index,
        attrs: {
          ...defaultAnchorStyle,
          x: anchorPointX,
          y: anchorPointY,
        },
      });
    })
  },
}, 'node')
