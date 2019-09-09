import { CanvasRenderer } from './renderers/canvas'
import * as spriteClassMap from '../sprites'
import { BaseIncident } from './incidents/BaseIncident'
import { Dialog } from './Dialog'
import { GameLoop } from './GameLoop'
import { Camera } from './Camera'

const DEFAULT_GAME_WIDTH = 1280
const DEFAULT_GAME_HEIGHT = 1280
const DEFAULT_NUM_TILE_WIDTH = 32
const DEFAULT_NUM_TILE_HEIGHT = 32

const DEFAULT_TILE_WIDTH = 20
const DEFAULT_TILE_HEIGHT = 20

// Can be 'fit', 'fixed'
const DEFAULT_SCALE_MODE = 'fit'
const DEFAULT_BACKGROUND_COLOR = '#000'
const DEFAULT_FPS = 60
const DEFAULT_RENDERER = new CanvasRenderer()

export class Game {
  constructor(options = {}) {
    Object.assign(
      this,
      {
        tileWidth: DEFAULT_TILE_WIDTH,
        tileHeight: DEFAULT_TILE_HEIGHT,
        scaleMode: DEFAULT_SCALE_MODE,
        backgroundColor: DEFAULT_BACKGROUND_COLOR,
        fps: DEFAULT_FPS,
        flag: {},
        container: document.createElement('div'),
        incidentPlays: [],
        incidentMap: {},
        sprites: [],
        layerMap: {},
        keyMap: {},
      },
      options
    )

    this.loop = new GameLoop({
      fps: this.fps,
    })

    this.camera = new Camera({
      game: this,
      width: options.cameraWidth,
      height: options.cameraHeight,
      x: options.cameraX,
      y: options.cameraY,
    })
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

    // document.addEventListener('scroll', evt => {
    //   evt.preventDefault()
    // })

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
      width = this.camera.width,
      height = this.camera.height,
      renderer = new CanvasRenderer({
        width,
        height,
        container: this.container,
        key: layerKey,
        game: this,
      }),
    } = {}
  ) {
    this.layerMap[layerKey] = renderer
  }

  /**
   * Add game incident function
   */
  addIncident({
    incidentClass = BaseIncident,
    key = Date.now().toString(),
    isForced = false,
    playerStatus = {},
    incidentStatus = {},
  }) {
    const incidentRecord =
      !isForced && this.incidentMap[key]
        ? this.incidentMap[key]
        : {
            timeStamps: [],
            incident: new incidentClass({
              key,
              game: this,
              playerStatus,
              incidentStatus,
            }),
          }

    incidentRecord.timeStamps.push(Date.now())
    this.incidentMap[key] = incidentRecord

    // Start/Restart the incident
    const incident = incidentRecord.incident
    // Make sure incident has updated playerStatus
    incident.playerStatus = playerStatus
    incident.restart()
    this.incidentPlays.push(incident.play.bind(incident))
  }

  /**
   * Create a sprite object
   * @param {string} spriteKey the key to hash sprite data
   */
  createTileSprite(spriteKey = '', options = {}) {
    const spriteOption = Object.assign({ type: 'tileSprite' }, options)
    return new this.spriteClassMap[spriteKey](spriteOption)
  }

  createObjectSprite(spriteKey = '', options = {}) {
    const spriteOption = Object.assign({ type: 'objectSprite' }, options)
    return new this.spriteClassMap[spriteKey](spriteOption)
  }

  playConversation(contentObjs = [], callback = () => {}) {
    this.dialog = new Dialog(contentObjs, this)
    this.dialog.start()
    this.dialog.endCallbacks.push(
      callback,
      (() => {
        delete this.dialog
      }).bind(this)
    )
  }

  // Pause the game
  pause() {
    this.loop.stop()
  }

  resume() {
    this.loop.start()
  }

  // Nothing can move now
  pauseMove() {
    this.flag.disableMove = true
  }

  resumeMove() {
    this.flag.disableMove = false
  }
}
