import React from 'react';
import ReactDOM from 'react-dom';
import G6 from '@antv/g6'
import './lib'
import './components/RegisterJumpNode'
import './components/RegisterNormalNode'
import './index.css';


class App extends React.Component {
  graph: any;
  state = {
    data: {}
  }

  componentDidMount() {
    this.initGraph()
    this.initItemPanel()
    this.bindEvent()
  }

  private initGraph(): void {
    const container = document.querySelector('#flow')!
    const { width, height } = container.getBoundingClientRect()
    this.graph = new G6.Graph({
      container: 'flow',
      width,
      height,
      modes: {
        default: [
          'zoom-canvas',
          {
            type: 'drag-node',
            shouldBegin(ev) {
              if (ev.target.get('name') === 'anchor') return false
              return true
            },
          },
          'click-select',
          'drag-node-to-editor',
          {
            type: 'drag-connect-node',
          },
          'click-select-edge',
        ]
      },
    })
    this.graph.on('canvas:mousemove', (ev) => {
      ev.event.target.style.cursor = 'pointer'
    })
  }

  private initItemPanel(): void {
    const items = [
      {
        type: 'circle',
        width: 200,
        height: 100,
        label: '请编辑节点内容',
        shape: 'jump-node',
      },
      {
        type: 'rect',
        width: 290,
        height: 132,
        label: '矩形',
        shape: 'normal-node',
      },
    ]
    const container = document.querySelector('#item-panel')!
    container.addEventListener('mousedown', (e) => {
      const target = e.target as Element
      const type = target.getAttribute('data-type')
      this.graph.emit('flow:addnode', items.find(item => item.type === type))
    })
  }

  private bindEvent(): void {
    window.addEventListener('keyup', (ev) => {
      // 删除
      if (ev.keyCode === 8) {
        this.graph.setAutoPaint(false)
        this.graph.findAllByState('node', 'selected').forEach((item) => {
          this.graph.remove(item)
        })
        this.graph.findAllByState('edge', 'selected').forEach((item) => {
          this.graph.remove(item)
        })
        this.graph.paint()
        this.graph.setAutoPaint(true)
      }
    })
  }

  handleSave = () => {
    const data = this.graph.save()
		console.log("TCL: App -> handleSave -> data", data)
    this.setState({ data })
  }

  render() {
    const { data } = this.state
    return (
      <div id="editor" className="editor-container">
        <div className="toolbar">
          <button onClick={this.handleSave}>保存</button>        
          <button onClick={() => { this.graph.changeData({}) }}>清除</button>        
          <button onClick={() => { this.graph.changeData(data) }}>读取</button>        
        </div>
        <div className="content">
          <div className="item-panel" id="item-panel">
            <img data-type="circle" width="80" height="80" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxjaXJjbGUgaWQ9ImIiIGN4PSIzNiIgY3k9IjM2IiByPSIzNiIvPjxmaWx0ZXIgeD0iLTkuNyUiIHk9Ii02LjklIiB3aWR0aD0iMTE5LjQlIiBoZWlnaHQ9IjExOS40JSIgZmlsdGVyVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94IiBpZD0iYSI+PGZlT2Zmc2V0IGR5PSIyIiBpbj0iU291cmNlQWxwaGEiIHJlc3VsdD0ic2hhZG93T2Zmc2V0T3V0ZXIxIi8+PGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMiIgaW49InNoYWRvd09mZnNldE91dGVyMSIgcmVzdWx0PSJzaGFkb3dCbHVyT3V0ZXIxIi8+PGZlQ29tcG9zaXRlIGluPSJzaGFkb3dCbHVyT3V0ZXIxIiBpbjI9IlNvdXJjZUFscGhhIiBvcGVyYXRvcj0ib3V0IiByZXN1bHQ9InNoYWRvd0JsdXJPdXRlcjEiLz48ZmVDb2xvck1hdHJpeCB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAuMDQgMCIgaW49InNoYWRvd0JsdXJPdXRlcjEiLz48L2ZpbHRlcj48L2RlZnM+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0IDIpIj48dXNlIGZpbGw9IiMwMDAiIGZpbHRlcj0idXJsKCNhKSIgeGxpbms6aHJlZj0iI2IiLz48dXNlIGZpbGwtb3BhY2l0eT0iLjkyIiBmaWxsPSIjRkZGMkU4IiB4bGluazpocmVmPSIjYiIvPjxjaXJjbGUgc3Ryb2tlPSIjRkZDMDY5IiBjeD0iMzYiIGN5PSIzNiIgcj0iMzUuNSIvPjwvZz48dGV4dCBmb250LWZhbWlseT0iUGluZ0ZhbmdTQy1SZWd1bGFyLCBQaW5nRmFuZyBTQyIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIuNjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQgMikiPjx0c3BhbiB4PSIyMyIgeT0iNDEiPlN0YXJ0PC90c3Bhbj48L3RleHQ+PC9nPjwvc3ZnPg==" alt="flow-circle" draggable={false} />
            <img data-type="rect" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iNTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxyZWN0IGlkPSJiIiB4PSIwIiB5PSIwIiB3aWR0aD0iODAiIGhlaWdodD0iNDgiIHJ4PSI0Ii8+PGZpbHRlciB4PSItOC44JSIgeT0iLTEwLjQlIiB3aWR0aD0iMTE3LjUlIiBoZWlnaHQ9IjEyOS4yJSIgZmlsdGVyVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94IiBpZD0iYSI+PGZlT2Zmc2V0IGR5PSIyIiBpbj0iU291cmNlQWxwaGEiIHJlc3VsdD0ic2hhZG93T2Zmc2V0T3V0ZXIxIi8+PGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMiIgaW49InNoYWRvd09mZnNldE91dGVyMSIgcmVzdWx0PSJzaGFkb3dCbHVyT3V0ZXIxIi8+PGZlQ29tcG9zaXRlIGluPSJzaGFkb3dCbHVyT3V0ZXIxIiBpbjI9IlNvdXJjZUFscGhhIiBvcGVyYXRvcj0ib3V0IiByZXN1bHQ9InNoYWRvd0JsdXJPdXRlcjEiLz48ZmVDb2xvck1hdHJpeCB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAuMDQgMCIgaW49InNoYWRvd0JsdXJPdXRlcjEiLz48L2ZpbHRlcj48L2RlZnM+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0IDIpIj48dXNlIGZpbGw9IiMwMDAiIGZpbHRlcj0idXJsKCNhKSIgeGxpbms6aHJlZj0iI2IiLz48dXNlIGZpbGwtb3BhY2l0eT0iLjkyIiBmaWxsPSIjRTZGN0ZGIiB4bGluazpocmVmPSIjYiIvPjxyZWN0IHN0cm9rZT0iIzE4OTBGRiIgeD0iLjUiIHk9Ii41IiB3aWR0aD0iNzkiIGhlaWdodD0iNDciIHJ4PSI0Ii8+PC9nPjx0ZXh0IGZvbnQtZmFtaWx5PSJQaW5nRmFuZ1NDLVJlZ3VsYXIsIFBpbmdGYW5nIFNDIiBmb250LXNpemU9IjEyIiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9Ii42NSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNCAyKSI+PHRzcGFuIHg9IjIxIiB5PSIyOSI+Tm9ybWFsPC90c3Bhbj48L3RleHQ+PC9nPjwvc3ZnPg==" alt="flow-rect" draggable={false} />
          </div>
          <div id="flow"></div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));

