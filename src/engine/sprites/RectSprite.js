const DEFAULT_RECT_SPRITE_WIDTH = 50
const DEFAULT_RECT_SPRITE_HEIGHT = 50

export class RectSprite {
  constructor(options = {}) {
    Object.assign(
      this,
      {
        x: 0,
        y: 0,
        pixelWidth: DEFAULT_RECT_SPRITE_WIDTH,
        pixelHeight: DEFAULT_RECT_SPRITE_HEIGHT,
        // TODO: have engine level palette
        backgroundColor: 'red',
        type: 'sprite',
      },
      options
    )
  }

  update(dt) {}

  render(renderer) {
    renderer.drawRect({
      x: this.x,
      y: this.y,
      pixelWidth: this.pixelWidth,
      pixelHeight: this.pixelHeight,
      backgroundColor: this.backgroundColor,
    })
  }
}
