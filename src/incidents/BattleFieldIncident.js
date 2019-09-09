import { SceneSprite } from '../engine/sprites/SceneSprite'
import { kingIntroduction } from './conversations/king'
import { palette } from '../utils/colors'

import { generateMapData } from '../utils/mapGenerator'
import { CastleHallBeginIncident } from './CastleHallBeginIncident'
import { GameIncident } from './GameIncident'
import * as npcConversation from './conversations/npc'
import { random } from '../utils/random'

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
      width: this.colNum,
      height: this.rowNum,
      tileWidth: this.game.tileWidth,
      tileHeight: this.game.tileHeight,
      objects: (this.incidentStatus.npcs || []).concat([
        {
          x: (this.width - this.objectWidth.m) / 2,
          y: (this.height - this.objectHeight.l) / 2,
          width: this.objectWidth.m,
          height: this.objectHeight.l,
          name: 'player',
        },
      ]),
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

    if (
      this.cellRow === this.game.maze.startRow &&
      this.cellCol === this.game.maze.startCol
    ) {
      // If this is the start cell, we need to handle introduction
      const johnSprite = this.mapGroup.getSpriteByName('john')
      if (!johnSprite.state.hasIntroduced) {
        this.doorScenes.forEach(doorScene => {
          if (doorScene.name === 'topDoor') {
            return
          }

          doorScene.backgroundColor = palette.red[3]
          doorScene.hitType = 'stop'
        })
      }
    }
  }

  setCamera() {
    const playerSprite = this.mapGroup.getSpriteByName('player')
    this.game.camera.follow(playerSprite)
  }

  bindEventCallback() {
    this.handleDoors()
    this.handleNpcs()
  }

  handleDoors() {
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
            rowNum: Math.floor(random.nextFloat() * 32 + 16),
            colNum: Math.floor(random.nextFloat() * 32 + 16),
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

  handleNpcs() {
    const npcs = this.incidentStatus.npcs || []

    npcs.forEach(npc => {
      const npcSprite = this.mapGroup.getSpriteByName(npc.name)
      npcSprite.hitCallback = sprite => {
        if (!this.game.dialog) {
          // Only play conversation when there is no dialog right now
          this.game.playConversation(
            npcConversation[npc.name](npcSprite, sprite, this)
          )
        }
      }
    })
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
