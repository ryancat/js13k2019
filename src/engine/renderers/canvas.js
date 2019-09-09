const DEFAULT_RENDERER_WIDTH = 500
const DEFAULT_RENDERER_HEIGHT = 500
const DEFAULT_DRAW_WIDTH = 20
const DEFAULT_DRAW_HEIGHT = 20
const DEFAULT_DRAW_BACKGROUND_COLOR = 'red'
const DEFAULT_DRAW_BORDER_COLOR = 'black'

export class CanvasRenderer {
  constructor({
    width = DEFAULT_RENDERER_WIDTH,
    height = DEFAULT_RENDERER_HEIGHT,
    container = document.createElement('div'),
    key = 'canvasLayer',
    game,
  } = {}) {
    this.container = container
    this.key = key
    this.game = game
    this._canvas = document.createElement('canvas')
    this._ctx = this._canvas.getContext('2d')

    // Set canvas style
    this._canvas.style.position = 'absolute'
    this._canvas.setAttribute('data-key', this.key)
    this.container.appendChild(this._canvas)

    // Init the canvas size
    this.setSize(width, height)
  }

  setSize(width = 300, height = 150) {
    if (
      this._canvas.offsetWidth !== width ||
      this._canvas.offsetHeight !== height
    ) {
      this._canvas.style.offsetWidth = width + 'px'
      this._canvas.style.offsetHeight = height + 'px'
    }

    this._canvas.width = width
    this._canvas.height = height
  }

  drawRect({
    x = 0,
    y = 0,
    width = this._canvas.width,
    height = this._canvas.height,
    shouldFill = true,
    shouldStroke = false,
    backgroundColor = DEFAULT_DRAW_BACKGROUND_COLOR,
    borderColor = DEFAULT_DRAW_BORDER_COLOR,
    opacity = 1,
  } = {}) {
    const context = this._ctx
    context.save()
    context.globalAlpha = opacity
    context.fillStyle = backgroundColor
    context.strokeStyle = borderColor

    // Draw rect path
    context.beginPath()
    context.rect(x, y, width, height)

    if (shouldFill) {
      context.fill()
    }

    if (shouldStroke) {
      context.stroke()
    }

    context.restore()
  }

  drawText({
    x = 0,
    y = 0,
    align = 'left',
    baseline = 'alphabetic',
    text = 'PLACE_HOLDER',
    fontSize = '16',
    color = DEFAULT_DRAW_BACKGROUND_COLOR,
  } = {}) {
    const context = this._ctx
    context.save()
    context.font = `${fontSize}px serif`
    context.fillStyle = color
    context.textAlign = align
    context.textBaseline = baseline
    context.fillText(text, x, y)

    context.restore()
  }

  clearRect({
    x = 0,
    y = 0,
    width = this._canvas.width,
    height = this._canvas.height,
  } = {}) {
    this._ctx.clearRect(x, y, width, height)
  }
}
