import { generateMapData } from '../maps/castle/createCastleHall'
import { BaseIncident } from '../engine/incidents/BaseIncident'
import { Game } from '../engine/Game'

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

    // interaction detection
    if (this.game.keyMap.up.isDown) {
      // up key is pressed
      playerSprite.y -= 0.15 * dt
    }
    if (this.game.keyMap.down.isDown) {
      // up key is pressed
      playerSprite.y += 0.15 * dt
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
      console.log('hit')
    }
  }
}
