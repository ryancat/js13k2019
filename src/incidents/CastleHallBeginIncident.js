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
    if (upKey.isDown) {
      // up key is pressed
      // playerSprite.y += playerSprite.vy * dt
      playerSprite.y += playerSprite.vy
      playerSprite.vy = -playerSprite.vMax

      // TODO: think about easing later
      // playerSprite.vy -= easingFn.easeInQuad(upKey.pressDuration / 1000) * dt
      // playerSprite.vy -= (1 / 1000) * dt
      // playerSprite.vy = Math.min(
      //   playerSprite.vMax,
      //   Math.max(-playerSprite.vMax, playerSprite.vy)
      // )
      // console.log(playerSprite.vy, playerSprite.y)
      // playerSprite.y -= 0.15 * dt
    }

    if (downKey.isDown) {
      // down key is pressed
      // playerSprite.y += playerSprite.vy * dt
      playerSprite.y += playerSprite.vy
      playerSprite.vy = playerSprite.vMax

      // // playerSprite.vy += easingFn.easeInQuad(upKey.pressDuration / 1000) * dt
      // playerSprite.vy += (1 / 1000) * dt
      // playerSprite.vy = Math.min(
      //   playerSprite.vMax,
      //   Math.max(-playerSprite.vMax, playerSprite.vy)
      // )
      // console.log(playerSprite.vy, playerSprite.y)
      // playerSprite.y += 0.15 * dt
    }
    if (this.game.keyMap.left.isDown) {
      // up key is pressed
      playerSprite.x -= 0.15 * dt
    }
    if (this.game.keyMap.right.isDown) {
      // up key is pressed
      playerSprite.x += 0.15 * dt
    }

    // hit detection
    if (Game.hitTestRect(playerSprite, kingSprite)) {
      console.log('hit king')
    }

    if (Game.hitTestRects(playerSprite, wallSprites)) {
      // do {
      //   // playerSprite.y -= playerSprite.vy * dt
      //   playerSprite.y -= playerSprite.vy
      // } while (Game.hitTestRects(playerSprite, wallSprites))

      playerSprite.y -= playerSprite.vy
      playerSprite.vy = 0
    }
  }
}
