import { Sprite } from './Sprite'
const DEFAULT_RECT_SPRITE_WIDTH = 50
const DEFAULT_RECT_SPRITE_HEIGHT = 50

export class RectSprite extends Sprite {
  constructor(options = {}) {
    super()
    Object.assign(
      this,
      {
        x: 0,
        y: 0,
        width: DEFAULT_RECT_SPRITE_WIDTH,
        height: DEFAULT_RECT_SPRITE_HEIGHT,
        // TODO: have engine level palette
        backgroundColor: 'red',
        type: 'sprite',
        tileIndex: -1,
        colIndex: -1,
        rowIndex: -1,
        name: '',
        hitArea: {},
      },
      options
    )

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

      renderer.drawText({
        x: this.x + this.width / 2,
        y: this.y + this.height / 2,
        align: 'center',
        verticalAlign: 'middle',
        text: this.tileIndex,
        color: 'red',
      })
    }
  }
}
