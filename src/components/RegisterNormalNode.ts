/**
 * 定义普通节点
 */
import G6 from '@antv/g6'
import { optimizeMultilineText } from '../utils';

const OPERATION = {
  // 编辑
  'EDIT': 'EDIT',
  // 删除
  'DEL': 'DEL',
}

const operationList = [
  {
    name: OPERATION.DEL,
    iconUrl: 'https://img.alicdn.com/tfs/TB1vaomoQvoK1RjSZFDXXXY3pXa-14-15.svg',
    size: 14,
  },
  {
    name: OPERATION.EDIT,
    iconUrl: 'https://img.alicdn.com/tfs/TB1rNAloHrpK1RjSZTEXXcWAVXa-14-14.svg',
    size: 14,
  },
]

const uiConfig = {
  keyShapeStyle: {
    // 默认卡片宽，基于挂的意图节点数量动态增大
    width: 290,
    // 固定头部高度
    headerHeight: 34,
    // 固定话术内容高度
    bodyHeight: 58,
    // 固定底部高度
    footerHeight: 40,
    fill: '#fff',
    stroke: '#CED4D9',
    radius: 2,
    shadowOffsetX: 0,
    shadowOffsetY: 4,
    shadowBlur: 10,
    shadowColor: 'rgba(13, 26, 38, 0.08)',
  },
  defaultIntentKeyShape: {
    width: 90,
    height: 24,
    fill: '#F4F4F4',
  },
  textStyle: {
    textAlign: 'start',
    textBaseline: 'top',
  },
}

G6.registerNode('normal-node', {
  draw(cfg, group) {
    this.mainGroup = group
    this.model = cfg
    const { width, headerHeight, bodyHeight, footerHeight } = uiConfig.keyShapeStyle
    // 最小宽度
    this.width = width
    // 固定高度
    this.height = headerHeight + bodyHeight + footerHeight
    // 原点为矩形中心，所以要做偏移，偏移后x,y为左上角点，后续所有计算基于此点
    this.originX = -this.width / 2
    this.originY = -this.height / 2
    this.keyShape = this._drawKeyShape()
    this.headerShape = this._drawHeaderShape()
    cfg.anchorPoints = [
      [0.25, 1, { type: 'out' }],
      [0.5, 1, { type: 'out' }],
      [0.75, 1, { type: 'out' }],
    ]
    return this.keyShape
  },
  _drawKeyShape() {
    return this.mainGroup.addShape('rect', {
      attrs: {
        x: this.originX,
        y: this.originY,
        width: this.width,
        height: this.height,
        ...uiConfig.keyShapeStyle,
      },
    })
  },
  // 绘制头部，两个icon
  _drawHeaderShape() {
    const headerShape = this.mainGroup.addGroup()
    // 画头部 icon
    // 在最右边
    let offsetX = this.originX + this.width - 10
    const copyOperationList = operationList.slice()
    copyOperationList.forEach((operation) => {
      headerShape.addShape('image', {
        name: operation.name,
        attrs: {
          img: operation.iconUrl,
          x: offsetX - operation.size,
          y: this.originY + 10,
          width: operation.size,
          height: operation.size,
        },
      })
      offsetX = offsetX - 10 - operation.size
    })
    return headerShape
  },
}, 'anchor-node')
