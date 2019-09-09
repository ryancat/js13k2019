import { palette } from '../utils/colors'
import { GameLoop } from './GameLoop'
import { getWrappedStrings } from './utils/string'

const PADDING = 0.05
const RATIO_Y = 0.8
const CONTENT_START_RATIO_X = 0.2
const FONT_SIZE = 20

export class Dialog {
  constructor(contentObjs = [], game, layerKey = 'foreground') {
    const camera = game.camera

    Object.assign(this, {
      contentObjs,
      game,
      layerKey,
      loop: new GameLoop(),
      endCallbacks: [],
      renderer: game.layerMap[layerKey],
      enterKey: game.keyMap.enter,
      enterKeyActive: false,
      activeContentIndex: 0,
    })

    this.loop.add(this.update.bind(this))
    this.loop.start()
  }

  start() {
    // Pause game
    this.game.pauseMove()
  }

  update(dt) {
    // We need to show next conversation
    let activeContent = this.contentObjs[this.activeContentIndex]

    if (typeof activeContent === 'string') {
      activeContent = {
        fromSpriteKey: '',
        content: activeContent,
        contentCallback: () => {},
        options: {},
      }
    }

    const {
      fromSpriteKey = '',
      content = '',
      contentCallback = () => {},
      options = {},
    } = activeContent

    this.clear()

    const camera = this.game.camera
    // const x = 0
    // const y = ,
    // width = ,
    // height: ,
    // contentX: Math.floor(camera.width * (CONTENT_START_RATIO_X + PADDING)),
    // contentY: ,
    // contentWidth:
    //   camera.width -
    //   Math.floor(camera.width * (CONTENT_START_RATIO_X + PADDING * 2)),
    // contentHeight:
    //   camera.height - Math.floor(camera.height * (RATIO_Y + PADDING * 2)),

    // Draw dialog box
    this.renderer.drawRect({
      x: 0,
      y: camera.height * RATIO_Y,
      width: camera.width,
      height: camera.height - Math.floor(camera.height * RATIO_Y),
      opacity: 0.95,
      shouldFill: true,
      shouldStroke: false,
      backgroundColor: palette.blue[3],
    })

    // Draw dialog from character sprite
    new this.game.spriteClassMap[fromSpriteKey]({
      x: camera.x,
      y: camera.y + camera.height * RATIO_Y,
      width: Math.floor(camera.width * CONTENT_START_RATIO_X),
      height: camera.height - Math.floor(camera.height * RATIO_Y),
    }).render(dt, this.renderer)

    // Draw text content
    getWrappedStrings(content, {
      maxWrappedWidth:
        camera.width -
        Math.floor(camera.width * (CONTENT_START_RATIO_X + PADDING * 2)),
      maxWrappedHeight:
        camera.height - Math.floor(camera.height * (RATIO_Y + PADDING * 2)),
      maxLineNum: Infinity,
      fontSize: FONT_SIZE,
    }).forEach((wrappedContent, index) => {
      this.renderer.drawText({
        x: Math.floor(camera.width * (CONTENT_START_RATIO_X + PADDING)),
        y: Math.floor(camera.height * (RATIO_Y + PADDING)) + index * FONT_SIZE,
        text: wrappedContent,
        align: 'start',
        color: options.color || palette.gunmetal[4],
        fontSize: FONT_SIZE,
      })
    })

    // Handle keystroke states
    if (this.enterKey.isDown) {
      this.enterKeyActive = true
    }

    if (!this.enterKey.isDown && this.enterKeyActive) {
      this.enterKeyActive = false
      this.activeContentIndex++
      contentCallback()

      if (this.activeContentIndex >= this.contentObjs.length) {
        // Reach the end of conversation
        this.end()
      }
    }
  }

  clear() {
    // Clear drawing
    this.renderer.clearRect({
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    })
  }

  end() {
    // Deregister update callback
    this.loop.destroy()

    // Clear dialog
    this.clear()

    // Post callbacks
    this.endCallbacks.forEach(callback => callback())

    // Resume game
    this.game.resumeMove()
  }
}
