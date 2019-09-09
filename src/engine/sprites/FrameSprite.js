// import { Sprite } from './Sprite'

// const DEFAULT_FRAME_SPRITE_FPS = 10

// export class FrameSprite extends Sprite {
//   constructor(options = {}) {
//     super(
//       Object.assign(
//         {
//           frameMap: {},
//           activeFrames: [],
//           fps: DEFAULT_FRAME_SPRITE_FPS,
//           currentFrameIndex: 0,
//           currentFrameDuration: 0,
//         },
//         options
//       )
//     )

//     this.setActiveFrames(Object.keys(this.frameMap))
//   }

//   get hitArea() {
//     const activeFrameSprite = this.activeFrames[this.currentFrameIndex]
//     if (!activeFrameSprite) {
//       return this._hitArea
//     }

//     return activeFrameSprite.hitArea
//   }

//   set hitArea(hitArea) {
//     // We don't care the frameSprite's hitArea, as the hitArea
//     // is set on each frame sprites
//     this._hitArea = hitArea
//   }

//   get y() {
//     return this._y
//   }

//   set y(yPos) {
//     this._y = yPos
//     for (let frameKey in this.frameMap) {
//       this.frameMap[frameKey].y = yPos
//     }
//   }

//   get x() {
//     return this._x
//   }

//   set x(xPos) {
//     this._x = xPos
//     for (let frameKey in this.frameMap) {
//       this.frameMap[frameKey].x = xPos
//     }
//   }

//   addFrame(frameKey = '', frame) {
//     this.frameMap[frameKey] = frame
//   }

//   setHitArea({
//     localX = 0,
//     localY = 0,
//     localWidth = this.width,
//     localHeight = this.height,
//   } = {}) {
//     for (let frameKey in this.frameMap) {
//       this.frameMap[frameKey].setHitArea({
//         localX,
//         localY,
//         localWidth,
//         localHeight,
//       })
//     }
//   }

//   setActiveFrames(frameKeys) {
//     this.activeFrames = frameKeys.map(frameKey => this.frameMap[frameKey])
//   }

//   render(dt, renderer) {
//     if (!this.activeFrames.length) {
//       this.currentFrameDuration = 0
//       return
//     }

//     this.currentFrameDuration += dt
//     while (this.currentFrameDuration >= 1000 / this.fps) {
//       this.currentFrameDuration -= 1000 / this.fps
//       this.currentFrameIndex =
//         (this.currentFrameIndex + 1) % this.activeFrames.length
//     }

//     this.activeFrames[this.currentFrameIndex].render(dt, renderer)
//   }
// }
