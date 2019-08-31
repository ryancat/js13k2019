import { Sprite } from './Sprite'

const DEFAULT_FRAME_SPRITE_FPS = 60

export class FrameSprite extends Sprite {
  constructor(options = {}) {
    super()

    Object.assign(
      this,
      {
        orderedFrames: [],
        fps: DEFAULT_FRAME_SPRITE_FPS,
        currentFrameIndex: 0,
        currentFrameDuration: 0,
      },
      options
    )
  }

  addFrame(frame) {
    this.orderedFrames.push(frame)
  }

  moveTo(x = 0, y = 0) {
    this.x = x
    this.y = y
    this.orderedFrames.forEach(frame => frame.moveTo(x, y))
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
    this.orderedFrames.forEach(frame =>
      frame.setHitArea({
        localX,
        localY,
        localWidth,
        localHeight,
      })
    )
  }

  render(dt, renderer) {
    this.currentFrameDuration += dt
    while (this.currentFrameDuration >= 1000 / this.fps) {
      this.currentFrameDuration -= 1000 / this.fps
      this.orderedFrames[this.currentFrameIndex].render(dt, renderer)
      this.currentFrameIndex =
        (this.currentFrameIndex + 1) % this.orderedFrames.length
    }
  }
}
