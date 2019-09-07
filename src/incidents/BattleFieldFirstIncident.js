import { SceneSprite } from '../engine/sprites/SceneSprite'
import { kingIntroduction } from './conversations/king'
import { palette } from '../utils/colors'

import { generateMapData } from '../utils/mapGenerator'
import { CastleHallBeginIncident } from './CastleHallBeginIncident'
import { GameIncident } from './GameIncident'

export class BattleFieldFirstIncident extends GameIncident {
  constructor(options = {}) {
    super(options)
  }

  // TODO: generate random map
  createMapData() {
    this.mapData = generateMapData({
      doors: ['top', 'left', 'right', 'bottom'],
      width: 32,
      height: 32,
      tileWidth: this.game.tileWidth,
      tileHeight: this.game.tileHeight,
      // objects: {
      //   player: {
      //     fromDoor: this.data.playerFromDoor,
      //   },
      // },
    })
  }

  update(dt) {
    const playerSprite = this.mapGroup.getSpriteByName('player')
    this.handlePlayerMove(playerSprite, dt)
  }

  addSceneSprites() {
    const topDoorScene = this.addSceneBySpriteName('topDoor', 'topDoorSprite')
    const rightDoorScene = this.addSceneBySpriteName(
      'rightDoor',
      'rightDoorSprite'
    )
    const bottomDoorScene = this.addSceneBySpriteName(
      'bottomDoor',
      'bottomDoorSprite'
    )
    const leftDoorScene = this.addSceneBySpriteName(
      'leftDoor',
      'leftDoorSprite'
    )
  }

  setCamera() {
    const playerSprite = this.mapGroup.getSpriteByName('player')
    this.game.camera.follow(playerSprite)
  }

  bindEventCallback() {
    const topDoorScene = this.getSceneByName('topDoor')

    topDoorScene.hitCallback = sprite => {
      if (topDoorScene.hitType === 'pass') {
        this.finish()

        // When we allow to pass, we need to switch to next incident
        this.game.addIncident({
          incidentClass: CastleHallBeginIncident,
          key: 'CastleHallBeginIncident',
          playerStatus: {
            fromDoor: 'bottom',
          },
        })
      }
    }

    // // TODO: REMOVE IN OFFICIAL GAME
    // doorSprite.backgroundColor = palette.green[3]
    // doorSprite.hitType = 'pass'
  }

  handlePlayerMove(playerSprite, dt) {
    // keys
    const upKey = this.game.keyMap.up
    const downKey = this.game.keyMap.down
    const leftKey = this.game.keyMap.left
    const rightKey = this.game.keyMap.right

    // interaction detection
    const diagonalDirection =
      (upKey.isDown || downKey.isDown) && (leftKey.isDown || rightKey.isDown)
    const projectSpeed = playerSprite.vMax / Math.sqrt(2)

    if (upKey.isDown) {
      // up key is pressed
      playerSprite.vy = -(diagonalDirection ? projectSpeed : playerSprite.vMax)
    }
    if (downKey.isDown) {
      // down key is pressed
      playerSprite.vy = diagonalDirection ? projectSpeed : playerSprite.vMax
    }
    if (leftKey.isDown) {
      // left key is pressed
      playerSprite.vx = -(diagonalDirection ? projectSpeed : playerSprite.vMax)
    }
    if (rightKey.isDown) {
      // right key is pressed
      playerSprite.vx = diagonalDirection ? projectSpeed : playerSprite.vMax
    }

    if (!upKey.isDown && !downKey.isDown) {
      playerSprite.vy = 0
    }

    if (!leftKey.isDown && !rightKey.isDown) {
      playerSprite.vx = 0
    }

    // TODO: we are only move at most vMax at one frame, this
    // maybe changed when we introduce dt and tweening. At that
    // time, we may move a lot more than vMax, which may mess up
    // with the current hit detection logic
    playerSprite.move()
  }
}
