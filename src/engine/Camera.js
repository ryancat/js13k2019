const DEFAULT_CAMERA_WIDTH = 640
const DEFAULT_CAMERA_HEIGHT = 640
const DEFAULT_FOLLOW_PADDING = 32

export class Camera {
  constructor({
    game,
    x = (game.width - DEFAULT_CAMERA_WIDTH) / 2,
    y = (game.height - DEFAULT_CAMERA_HEIGHT) / 2,
    width = DEFAULT_CAMERA_WIDTH,
    height = DEFAULT_CAMERA_HEIGHT,
  }) {
    Object.assign(this, {
      game,
      x,
      y,
      width,
      height,
    })
  }

  // camera will follow the given sprite from now
  follow(sprite, padding = {}) {
    const {
      top = DEFAULT_FOLLOW_PADDING,
      right = DEFAULT_FOLLOW_PADDING,
      bottom = DEFAULT_FOLLOW_PADDING,
      left = DEFAULT_FOLLOW_PADDING,
    } = padding

    const leftMargin = (this.width - sprite.width) / 2
    const topMargin = (this.height - sprite.height) / 2

    this.currentFollowCallback = () => {
      this.x = sprite.x - leftMargin
      this.y = sprite.y - topMargin
    }
    this.game.loop.add(this.currentFollowCallback.bind(this))
  }
}
