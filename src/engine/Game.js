import { CanvasRenderer } from './renderers/canvas'
import * as spriteClassMap from '../sprites'
import { BaseIncident } from './incidents/BaseIncident'

const DEFAULT_GAME_WIDTH = 480
const DEFAULT_GAME_HEIGHT = 480
const DEFAULT_NUM_TILE_WIDTH = 32
const DEFAULT_NUM_TILE_HEIGHT = 32
// Can be 'fit', 'fixed'
const DEFAULT_SCALE_MODE = 'fit'
const DEFAULT_BACKGROUND_COLOR = '#000'
const DEFAULT_FPS = 60
const DEFAULT_RENDERER = new CanvasRenderer()

export class Game {
  constructor({
    width = DEFAULT_GAME_WIDTH,
    height = DEFAULT_GAME_HEIGHT,
    colNum = DEFAULT_NUM_TILE_WIDTH,
    rowNum = DEFAULT_NUM_TILE_HEIGHT,
    scaleMode = DEFAULT_SCALE_MODE,
    backgroundColor = DEFAULT_BACKGROUND_COLOR,
    fps = DEFAULT_FPS,
    container = document.createElement('div'),
  }) {
    Object.assign(this, {
      width,
      height,
      colNum,
      rowNum,
      scaleMode,
      backgroundColor,
      sprites: [],
      container,
      flag: {},
      incidentPlays: [],
      incidentMap: {},
      layerMap: {},
      keyMap: {},
      loop: Game.createGameLoop(fps),
    })
  }

  static createGameLoop(fps) {
    const gameLoop = {
      fps,
      callbacks: [],
      isPaused: true,
      timeoutId: null,
    }

    gameLoop.add = (...callbacks) => {
      Array.prototype.push.apply(gameLoop.callbacks, callbacks)
    }

    gameLoop.remove = callback => {
      const index = gameLoop.callbacks.indexOf(callback)
      if (index >= 0) {
        gameLoop.callbacks.splice(index, 1)
      }
    }

    gameLoop.removeAll = () => {
      gameLoop.callbacks = []
    }

    gameLoop.run = () => {
      gameLoop.timeoutId = window.requestAnimationFrame(gameLoop.run)

      const now = Date.now()
      const lastRun = gameLoop.lastRun
      gameLoop.lastRun = now

      if (gameLoop.isPaused) {
        return
      }

      const dt = now - lastRun
      if (dt >= 1000 / fps) {
        // We need to check game fps to decide if we should run registered callbacks
        gameLoop.callbacks.forEach(callback => callback(dt))
      }
    }

    gameLoop.start = () => {
      gameLoop.isPaused = false
    }

    gameLoop.stop = () => {
      gameLoop.isPaused = true
      gameLoop.lastRun = null
    }

    gameLoop.run()
    gameLoop.lastRun = Date.now()

    return gameLoop
  }

  static createKeyInteraction(keyCodes = []) {
    const keyObj = {
      keyCodes,
      pressStartTime: null,
      pressDuration: 0,
      isDown: false,
    }

    document.addEventListener('keydown', evt => {
      if (keyObj.keyCodes.indexOf(evt.keyCode) === -1) {
        return
      }

      keyObj.isDown = true
      const now = Date.now()
      if (!keyObj.pressStartTime) {
        keyObj.pressStartTime = now
      } else {
        keyObj.pressDuration = now - keyObj.pressStartTime
      }
      evt.preventDefault()
    })

    document.addEventListener('keyup', evt => {
      if (keyObj.keyCodes.indexOf(evt.keyCode) === -1) {
        return
      }

      keyObj.isDown = false
      keyObj.pressStartTime = null
      keyObj.pressDuration = 0
      evt.preventDefault()
    })

    return keyObj
  }

  // Load all sprite classes
  loadSprites() {
    this.spriteClassMap = spriteClassMap
  }

  /**
   * Load sound assets
   */
  loadSounds() {}

  addInteractionKey(keyId, keyObj) {
    this.keyMap[keyId] = keyObj
  }

  /**
   * Add game layers
   */
  addLayer(
    layerKey = 'layer',
    {
      width = this.width,
      height = this.height,
      renderer = new CanvasRenderer({
        width,
        height,
        container: this.container,
        key: layerKey,
      }),
    } = {}
  ) {
    this.layerMap[layerKey] = renderer
  }

  /**
   * Add game incident function
   */
  addIncident(incidentClass = BaseIncident, key = Date.now().toString()) {
    const incident = new incidentClass({
      key,
      game: this,
    })

    this.incidentMap[key] = {
      timeStamp: Date.now(),
      incident,
    }

    this.incidentPlays.push(incident.play.bind(incident))
  }

  /**
   * Create a sprite object
   * @param {string} spriteKey the key to hash sprite data
   */
  createSprite(spriteKey = '', options = {}) {
    const spriteOption = Object.assign({}, options)
    return new this.spriteClassMap[spriteKey](spriteOption)
  }
}
