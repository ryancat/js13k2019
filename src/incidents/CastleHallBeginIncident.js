// import { generateMapData } from '../maps/castle/createCastleHall'
import { generateMapData } from '../utils/mapGenerator'
import { kingIntroduction } from './conversations/king'
import { palette } from '../utils/colors'
import { GameIncident } from './GameIncident'
import { BattleFieldIncident } from './BattleFieldIncident'
import { random } from '../utils/random'

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
      objects: [
        {
          x: (this.width - this.objectWidth.m) / 2,
          y: (this.height - this.objectHeight.l) / 4,
          width: this.objectWidth.m,
          height: this.objectHeight.l,
          name: 'king',
        },
        {
          x: (this.width - this.objectWidth.m) / 2,
          y: (this.height - this.objectHeight.l) / 2,
          width: this.objectWidth.m,
          height: this.objectHeight.l,
          name: 'player',
        },
      ],
    })
  }

  addSceneSprites() {
    this.castleDoorScene = this.addSceneBySpriteName(
      'castleDoor',
      'bottomDoorSprite'
    )

    this.castleDoorScene.backgroundColor = palette.red[3]
    this.castleDoorScene.hitType = 'stop'
  }

  setCamera() {
    const playerSprite = this.mapGroup.getSpriteByName('player')
    this.game.camera.follow(playerSprite, {
      // focusRatio: 2,
    })
  }

  bindEventCallback() {
    const kingSprite = this.mapGroup.getSpriteByName('king')

    kingSprite.hitCallback = sprite => {
      if (!this.game.dialog) {
        // Only play conversation when there is no dialog right now
        this.game.playConversation(kingIntroduction(kingSprite, sprite), () => {
          this.castleDoorScene.backgroundColor = palette.green[3]
          this.castleDoorScene.hitType = 'pass'
        })
      }
    }

    this.handleDoors()
  }

  handleDoors() {
    this.castleDoorScene.hitCallback = sprite => {
      if (this.castleDoorScene.hitType === 'pass') {
        this.finish()

        // When we allow to pass, we need to switch to next incident
        const rowNum = Math.floor(random.nextFloat() * 32 + 16)
        const colNum = Math.floor(random.nextFloat() * 32 + 16)
        const newIncidentWidth = colNum * this.game.tileWidth
        const newIncidentHeight = rowNum * this.game.tileHeight
        this.game.addIncident({
          incidentClass: BattleFieldIncident,
          key: `BattleFieldIncident@${this.game.maze.startRow}@${this.game.maze.startCol}`,
          rowNum,
          colNum,
          playerStatus: {
            fromDoor: 'top',
          },
          incidentStatus: {
            // rowNum: 32,
            // colNum: 32,
            // doorColor = palette.red[3], // can be any color in palette
            // groundColor = palette.green[4], // can be any color in palette
            // wallColor = palette.brown[3], // can be any color in palette
            // wallTopColor = palette.brown[1], // can be any color in palette
            // backgroundColor = palette.gunmetal[4], // can be any color in palette

            // npc object status for map
            npcs: [
              {
                name: 'john',
                width: this.objectWidth.m,
                height: this.objectHeight.l,
                x: (newIncidentWidth - this.objectWidth.m) / 2,
                y: (newIncidentHeight - this.objectHeight.l) / 2,
              },
            ],
          },
        })
      }
    }

    // TODO: REMOVE IN OFFICIAL GAME
    this.castleDoorScene.backgroundColor = palette.green[3]
    this.castleDoorScene.hitType = 'pass'
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
