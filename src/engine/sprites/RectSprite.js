import { Sprite } from './Sprite'
const DEFAULT_RECT_SPRITE_WIDTH = 50
const DEFAULT_RECT_SPRITE_HEIGHT = 50

export class RectSprite extends Sprite {
  constructor(options = {}) {
    super(
      Object.assign(
        {
          tileIndex: -1,
          colIndex: -1,
          rowIndex: -1,
        },
        options
      )
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

  render(dt, renderer) {
    const camera = renderer.game.camera
    const transformX = this.x - camera.x
    const transformY = this.y - camera.y

    if (
      transformX < -this.width ||
      transformX > camera.width ||
      transformY < -this.height ||
      transformY > camera.height
    ) {
      // Out of camera. no need to render
      return
    }

    renderer.drawRect({
      x: transformX,
      y: transformY,
      width: this.width,
      height: this.height,
      shouldFill: true,
      shouldStroke: false,
      backgroundColor: this.backgroundColor,
    })

    if (localStorage.getItem('GAME_DEBUG_MODE')) {
      renderer.drawRect({
        x: transformX + this.hitArea.localX,
        y: transformY + this.hitArea.localY,
        width: this.hitArea.localWidth,
        height: this.hitArea.localHeight,
        shouldFill: false,
        shouldStroke: true,
        borderColor: 'red',
      })
      // renderer.drawText({
      //   x: this.x + this.width / 2,
      //   y: this.y + this.height / 2,
      //   align: 'center',
      //   verticalAlign: 'middle',
      //   text: this.tileIndex,
      //   color: 'red',
      // })
    }
  }
}
