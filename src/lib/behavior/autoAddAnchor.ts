import G6 from '@antv/g6'
import Anchor from '../Anchor';

const anchor = new Anchor

// 自动为节点添加锚点
G6.registerBehavior('auto-add-anchor', {
  getDefaultCfg() {
    return {
    }
  },
  getEvents() {
   return {
    'aftereadditem': 'drawAnchor',
    'afteritemupdate': 'updateAnchor',
    'beforeremoveitem': 'clearAnchor'
   }
  },
  drawAnchor(ev) {
    if (ev.model.isShowAnchor) {
      anchor.updateAnchor(ev.model)
    }
  },
  updateAnchor(ev) {
    const model = ev.item.get('model')
    if (model.isShowAnchor) {
      anchor.updateAnchor(model)
    }
  },
  clearAnchor(ev) {
    const model = ev.item.get('model')
    if (model.isShowAnchor) {
      anchor.clearAnchorById(model.id)
    }
  }
})