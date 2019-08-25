const DEFAULT_RECT_SPRITE_WIDTH = 50
const DEFAULT_RECT_SPRITE_HEIGHT = 50

export class RectSprite {
  constructor({
    x = 0,
    y = 0,
    width = DEFAULT_RECT_SPRITE_WIDTH,
    height = DEFAULT_RECT_SPRITE_HEIGHT,
    // TODO: have engine level palette
    backgroundColor = 'red',
    type = 'sprite',
    name = '',
  } = {}) {
    Object.assign(this, {
      x,
      y,
      width,
      height,
      backgroundColor,
      type,
      name,
      hitArea: {
        x: 0,
        y: 0,
        width,
        height,
      },
    })
  }

  setHitArea({ x = 0, y = 0, width = this.width, height = this.height } = {}) {
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
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      backgroundColor: this.backgroundColor,
    })
  }
}
