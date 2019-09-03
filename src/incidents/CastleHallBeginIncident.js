import { generateMapData } from '../maps/castle/createCastleHall'
import { BaseIncident } from '../engine/incidents/BaseIncident'
import { SceneSprite } from '../engine/sprites/SceneSprite'
import { kingIntroduction } from './conversations/king'

export class CastleHallBeginIncident extends BaseIncident {
  constructor(options = {}) {
    super(options)
  }

  createMapData() {
    this.mapData = generateMapData({
      tileWidth: this.game.width / this.game.colNum,
      tileHeight: this.game.height / this.game.rowNum,
    })
  }

  update(dt) {
    const playerSprite = this.mapGroup.getSpriteByName('player')
    this.handlePlayerMove(playerSprite, dt)
  }

  addSceneSprites() {
    const kingSprites = this.mapGroup.getSpritesByName('kingSprite')
    const kingSceneSprite = new SceneSprite()
    kingSceneSprite.addSprites(kingSprites)
    kingSceneSprite.name = 'king'
    this.sceneSprites.push(kingSceneSprite)
  }

  bindEventCallback() {
    const kingSprite = this.getSceneByName('king')
    kingSprite.hitCallback = sprite => {
      console.log(sprite)
      if (!this.game.dialog) {
        // Only play conversation when there is no dialog right now
        this.game.playConversation(kingIntroduction(kingSprite, sprite))
      }
    }
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

  getSceneByName(sceneName = '') {
    return this.sceneSprites.filter(
      sceneSprite => sceneSprite.name === sceneName
    )[0]
  }
}
