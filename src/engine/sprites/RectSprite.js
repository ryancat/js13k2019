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
      hitArea: {},
    })

    this.setHitArea()
  }

  setHitArea({
    localX = 0,
    localY = 0,
    localWidth = this.width,
    localHeight = this.height,
  } = {}) {
    Object.assign(this.hitArea, {
      localX,
      localY,
      localWidth,
      localHeight,
    })
  }

  update(dt) {}

  render(renderer) {
    renderer.drawRect({
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      shouldFill: true,
      shouldStroke: false,
      backgroundColor: this.backgroundColor,
    })

    if (localStorage.getItem('GAME_DEBUG_MODE')) {
      renderer.drawRect({
        x: this.x + this.hitArea.localX,
        y: this.y + this.hitArea.localY,
        width: this.hitArea.localWidth,
        height: this.hitArea.localHeight,
        shouldFill: false,
        shouldStroke: true,
        borderColor: 'red',
      })
    }
  }
}
