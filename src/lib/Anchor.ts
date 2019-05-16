/*
 * @Description: 
 * @Author: zhaoqing
 * @Date: 2019-05-16 19:16:49
 * @LastEditTime: 2019-05-16 22:22:05
 */
import { getGraph } from "./Editor";

class Anchor {
  anchors: any[];
  constructor() {
    this.anchors = []
  }

  updateAnchor(model) {
    const needRemoveShape = this.anchors.filter(anchor => anchor.get('id') === model.id)
    needRemoveShape.forEach(shape => shape.remove())
    this.anchors = this.anchors.filter(anchor => anchor.get('id') !== model.id)
    this.drawAnchor(model)
  }

  drawAnchor(model){
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
          symbol: 'circle',
          radius: 3.5,
          fill: '#fff',
          stroke: '#1890FF',
          lineAppendWidth: 12,
          x: anchorPointX,
          y: anchorPointY,
        },
      });
      anchor.on('mousedown', (ev) => {
        graph.emit('anchor:mousedown', ev)
      })
      anchor.on('mouseenter', (ev) => {
        anchor.attr({
          radius: 4,
          fill: '#1890FF',
          stroke: '#1890FF'
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
      this.anchors.push(anchor)
    })
    graph.paint()
  }
}

export default Anchor