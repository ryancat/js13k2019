import { generateMapData } from '../maps/castle/createCastleHall'
import { BaseIncident } from '../engine/incidents/BaseIncident'
import { Game } from '../engine/Game'
import { easingFn } from '../engine/utils/easing'

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
    const kingSprite = this.mapGroup.getSpriteByName('king')
    const wallSprites = this.mapGroup.getSpritesByName('wall')

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
      playerSprite.y += playerSprite.vy
    }
    if (downKey.isDown) {
      // down key is pressed
      playerSprite.vy = diagonalDirection ? projectSpeed : playerSprite.vMax
      playerSprite.y += playerSprite.vy
    }
    if (leftKey.isDown) {
      // left key is pressed
      playerSprite.vx = -(diagonalDirection ? projectSpeed : playerSprite.vMax)
      playerSprite.x += playerSprite.vx
    }
    if (rightKey.isDown) {
      // right key is pressed
      playerSprite.vx = diagonalDirection ? projectSpeed : playerSprite.vMax
      playerSprite.x += playerSprite.vx
    }

    // hit detection
    if (Game.hitTestRect(playerSprite, kingSprite)) {
      console.log('hit king')
    }

    if (Game.hitTestRects(playerSprite, wallSprites)) {
      if (upKey.isDown || downKey.isDown) {
        playerSprite.y -= playerSprite.vy
        playerSprite.vy = 0
      }

      if (leftKey.isDown || rightKey.isDown) {
        playerSprite.x -= playerSprite.vx
        playerSprite.vx = 0
      }
    }
  }
}
