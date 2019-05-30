
const canvas = document.createElement('canvas')
const canvasContext = canvas.getContext('2d')!

export function optimizeMultilineText(text, font, maxWidth, maxHeight, lineHeight = 18) {
  canvasContext.font = font
  if (canvasContext.measureText(text) <= maxWidth) {
    return text
  }
  let multilineText = ''
  let multilineTextWidth = 0
  let currentHeight = lineHeight
  for (const char of text) {
    // 用户输入换行处理
    if (char === '\n') {
      multilineTextWidth = 0
      currentHeight += lineHeight
    }
    const { width } = canvasContext.measureText(char)
    // 加 \n 使文字折行
    if (multilineTextWidth + width >= maxWidth) {
      multilineText += '\n'
      multilineTextWidth = 0
      currentHeight += lineHeight
    }
    // 达到最大高度，给文本加省略号，不再继续计算
    if (currentHeight > maxHeight) {
      return `${multilineText.substring(0, multilineText.length - 1)}...`
    }
    multilineText += char
    multilineTextWidth += width
  }
  return multilineText
}