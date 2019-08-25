const DEFAULT_RECT_SPRITE_WIDTH = 50
const DEFAULT_RECT_SPRITE_HEIGHT = 50

export class RectSprite {
  constructor({
    pixelX = 0,
    pixelY = 0,
    pixelWidth = DEFAULT_RECT_SPRITE_WIDTH,
    pixelHeight = DEFAULT_RECT_SPRITE_HEIGHT,
    // TODO: have engine level palette
    backgroundColor = 'red',
    type = 'sprite',
    name = '',
  } = {}) {
    Object.assign(this, {
      pixelX,
      pixelY,
      pixelWidth,
      pixelHeight,
      backgroundColor,
      type,
      name,
      hitArea: {
        x: 0,
        y: 0,
        width: pixelWidth,
        height: pixelHeight,
      },
    })
  }

  setHitArea({
    x = 0,
    y = 0,
    width = this.pixelWidth,
    height = this.pixelHeight,
  } = {}) {
    Object.assign(this.hitArea, {
      x,
      y,
      width,
      height,
    })
  }

  update(dt) {}

  render(renderer) {
    renderer.drawRect({
      pixelX: this.pixelX,
      pixelY: this.pixelY,
      pixelWidth: this.pixelWidth,
      pixelHeight: this.pixelHeight,
      backgroundColor: this.backgroundColor,
    })
  }
}
