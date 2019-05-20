/*
 * @Description: 
 * @Author: zhaoqing
 * @Date: 2019-05-16 19:16:49
 * @LastEditTime: 2019-05-20 22:11:32
 */
import { getGraph } from "./Editor";
import { defaultAnchorStyle, hoverAnchorStyle } from "./global";

class Anchor {
  anchors: any[];
  constructor() {
    this.anchors = []
  }

  public drawAnchor(model): void {
    const graph = getGraph()
    const { id, anchorPoints, x, y, height, width } = model
    const parent = graph.get('group');
    anchorPoints.forEach((points, index) => {
      // 把原点置为图形左上角
      const originX = x - width / 2
      const originY = y - height / 2
      const anchorPointX = points[0] * width + originX
      const anchorPointY = points[1] * height + originY
      const anchor = parent.addShape('marker', {
        id: id,
        index,
        attrs: {
          ...defaultAnchorStyle,
          x: anchorPointX,
          y: anchorPointY,
        },
      });
      this.bindEvent(anchor)
      this.anchors.push(anchor)
    })
    graph.paint()
  }

  private bindEvent(anchor): void {
    const graph = getGraph()
    anchor.on('mousedown', (ev) => {
      graph.emit('anchor:mousedown', ev)
    })
    anchor.on('mouseenter', (ev) => {
      anchor.attr({
        ...hoverAnchorStyle,
      })
      graph.paint()
      graph.emit('anchor:mouseenter', ev)
    })
    anchor.on('mouseleave', (ev) => {
      anchor.attr({
        radius: 3.5,
        fill: '#fff',
      })
      graph.paint()
      graph.emit('anchor:mouseleave', ev)
    })
  }

  // 更新锚点，简单粗暴直接删掉原来的锚点，重新画
  public updateAnchor(model): void {
    const needRemoveShape = this.anchors.filter(anchor => anchor.get('id') === model.id)
    needRemoveShape.forEach(shape => shape.remove())
    this.anchors = this.anchors.filter(anchor => anchor.get('id') !== model.id)
    this.drawAnchor(model)
  }

  public clearAnchorById(id: string) {
    const graph = getGraph()
    this.anchors
      .filter(anchor => anchor.get('id') === id)
      .forEach(shape => shape.remove())
    graph.paint()
    this.anchors = this.anchors.filter(anchor => anchor.get('id') !== id)
  }
}

export default Anchor