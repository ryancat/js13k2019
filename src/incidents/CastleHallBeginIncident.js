// import { generateMapData } from '../maps/castle/createCastleHall'
import { generateMapData } from '../utils/mapGenerator'
import { SceneSprite } from '../engine/sprites/SceneSprite'
import { kingIntroduction } from './conversations/king'
import { palette } from '../utils/colors'
import { BattleFieldFirstIncident } from './BattleFieldFirstIncident'
import { GameIncident } from './GameIncident'

export class CastleHallBeginIncident extends GameIncident {
  constructor(options = {}) {
    super(options)
  }

  createMapData() {
    this.mapData = generateMapData({
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

  addSceneSprites() {
    this.addSceneBySpriteName('king', 'kingSprite')
    const castleDoorScene = this.addSceneBySpriteName(
      'castleDoor',
      'bottomDoorSprite'
    )
    castleDoorScene.backgroundColor = palette.red[3]
    castleDoorScene.hitType = 'stop'
  }

  setCamera() {
    // this.game.camera.width = this.game.width
    // this.game.camera.height = this.game.height
    const playerSprite = this.mapGroup.getSpriteByName('player')
    this.game.camera.follow(playerSprite, {
      // focusRatio: 2,
    })
  }

  bindEventCallback() {
    const kingSprite = this.getSceneByName('king')
    const doorSprite = this.getSceneByName('castleDoor')

    kingSprite.hitCallback = sprite => {
      console.log(sprite)
      if (!this.game.dialog) {
        // Only play conversation when there is no dialog right now
        this.game.playConversation(kingIntroduction(kingSprite, sprite), () => {
          doorSprite.backgroundColor = palette.green[3]
          doorSprite.hitType = 'pass'
        })
      }
    }

    doorSprite.hitCallback = sprite => {
      console.log(sprite)
      if (doorSprite.hitType === 'pass') {
        this.finish()

        // When we allow to pass, we need to switch to next incident
        this.game.addIncident({
          incidentClass: BattleFieldFirstIncident,
          key: 'BattleFieldFirstIncident',
          playerStatus: {
            fromDoor: 'top',
          },
        })
      }
    }

    // TODO: REMOVE IN OFFICIAL GAME
    doorSprite.backgroundColor = palette.green[3]
    doorSprite.hitType = 'pass'
  }

  update(dt) {
    const playerSprite = this.mapGroup.getSpriteByName('player')
    this.handlePlayerMove(playerSprite, dt)
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
