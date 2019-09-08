import { SceneSprite } from '../engine/sprites/SceneSprite'
import { kingIntroduction } from './conversations/king'
import { palette } from '../utils/colors'

import { generateMapData } from '../utils/mapGenerator'
import { CastleHallBeginIncident } from './CastleHallBeginIncident'
import { GameIncident } from './GameIncident'

export class BattleFieldIncident extends GameIncident {
  constructor(options = {}) {
    super(options)

    this.cellRow = parseInt(this.key.split('@')[1])
    this.cellCol = parseInt(this.key.split('@')[2])
  }

  // TODO: generate random map
  createMapData() {
    this.doors = GameIncident.hashDoor(
      this.game.maze.cells[this.cellRow][this.cellCol]
    )

    this.mapData = generateMapData({
      doors: this.doors.filter(door => door !== ''),
      width: 32,
      height: 32,
      tileWidth: this.game.tileWidth,
      tileHeight: this.game.tileHeight,
      objects: [
        {
          x: 240,
          y: 224,
          width: 32,
          height: 48,
          name: 'player',
        },
      ],
    })
  }

  update(dt) {
    const playerSprite = this.mapGroup.getSpriteByName('player')
    this.handlePlayerMove(playerSprite, dt)
  }

  addSceneSprites() {
    this.doorScenes = this.doors.map(door => {
      return door !== ''
        ? this.addSceneBySpriteName(`${door}Door`, `${door}DoorSprite`)
        : null
    })
  }

  setCamera() {
    const playerSprite = this.mapGroup.getSpriteByName('player')
    this.game.camera.follow(playerSprite)
  }

  bindEventCallback() {
    this.doorScenes.forEach((doorScene, doorIndex) => {
      if (!doorScene) {
        return
      }

      const lrIncrement = doorIndex === 1 ? 1 : doorIndex === 3 ? -1 : 0
      const tbIncrement = doorIndex === 0 ? -1 : doorIndex === 2 ? 1 : 0

      doorScene.hitCallback = sprite => {
        if (doorScene.hitType === 'pass') {
          this.finish()

          // When we allow to pass, we need to switch to next incident
          this.game.addIncident({
            incidentClass: BattleFieldIncident,
            key: `BattleFieldIncident@${this.cellRow + tbIncrement}@${this
              .cellCol + lrIncrement}`,
            playerStatus: {
              fromDoor: GameIncident.getOppositeDoor(this.doors[doorIndex]),
            },
          })

          console.log(
            `enter battlefield row: ${this.cellRow + tbIncrement}, col: ${this
              .cellCol + lrIncrement}`
          )
        }
      }
    })

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
