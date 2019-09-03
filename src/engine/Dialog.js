import { palette } from '../utils/colors'
import { GameLoop } from './GameLoop'
import { getWrappedStrings } from './utils/string'

const PADDING = 0.05
const RATIO_Y = 0.8
const CONTENT_START_RATIO_X = 0.2
const FONT_SIZE = 20

export class Dialog {
  constructor(contentObjs = [], game, layerKey = 'foreground') {
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
      x: 0,
      y: Math.floor(game.height * RATIO_Y),
      width: game.width,
      height: game.height - Math.floor(game.height * RATIO_Y),
      contentX: Math.floor(game.width * (CONTENT_START_RATIO_X + PADDING)),
      contentY: Math.floor(game.height * (RATIO_Y + PADDING)),
      contentWidth:
        game.width -
        Math.floor(game.width * (CONTENT_START_RATIO_X + PADDING * 2)),
      contentHeight:
        game.height - Math.floor(game.height * (RATIO_Y + PADDING * 2)),
    })

    this.loop.add(this.update.bind(this))
    this.loop.start()
  }

  start() {
    // Pause game
    this.game.pause()
  }

  update() {
    // We need to show next conversation
    const {
      from = '',
      content = '',
      contentCallback = () => {},
    } = this.contentObjs[this.activeContentIndex]

    this.clear()

    this.renderer.drawRect({
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      opacity: 0.9,
      shouldFill: true,
      shouldStroke: false,
      backgroundColor: palette.blue[3],
    })

    getWrappedStrings(content, {
      maxWrappedWidth: this.contentWidth,
      maxWrappedHeight: this.contentHeight,
      maxLineNum: Infinity,
      fontSize: FONT_SIZE,
    }).forEach((wrappedContent, index) => {
      this.renderer.drawText({
        x: this.contentX,
        y: this.contentY + this.contentHeight / 2 + index * FONT_SIZE,
        text: wrappedContent,
        align: 'start',
        color: 'red',
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
    this.game.resume()
  }
}
