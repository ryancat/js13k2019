const DEFAULT_CAMERA_WIDTH = 640
const DEFAULT_CAMERA_HEIGHT = 640
const DEFAULT_FOLLOW_PADDING = 32

export class Camera {
  constructor({
    game,
    x = 0,
    y = 0,
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
  follow(sprite, options = {}) {
    // const { focusRatio } = options

    // if (focusRatio) {
    //   this.width = sprite.width * focusRatio
    //   this.height = sprite.height * focusRatio
    // }

    const leftMargin = (this.width - sprite.width) / 2
    const topMargin = (this.height - sprite.height) / 2

    this.currentFollowCallback = () => {
      this.x = sprite.x - leftMargin
      this.y = sprite.y - topMargin
    }
    this.game.loop.add(this.currentFollowCallback.bind(this))
  }
}
