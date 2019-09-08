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
      followingSprite: null,
      followingCallback: null,
    })
  }

  // camera will follow the given sprite from now
  follow(sprite, options = {}) {
    // const { focusRatio } = options

    // if (focusRatio) {
    //   this.width = sprite.width * focusRatio
    //   this.height = sprite.height * focusRatio
    // }

    this.followingSprite = sprite

    if (this.followingCallback) {
      this.game.loop.remove(this.followingCallback)
    }

    this.followingCallback = this.updateCameraByFollow.bind(this)
    this.game.loop.add(this.followingCallback)

    this.updateCameraByFollow()
  }

  updateCameraByFollow() {
    const leftMargin = (this.width - this.followingSprite.width) / 2
    const topMargin = (this.height - this.followingSprite.height) / 2
    this.x = this.followingSprite.x - leftMargin
    this.y = this.followingSprite.y - topMargin
  }
}
