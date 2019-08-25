import { generateMapData } from '../maps/castle/createCastleHall'
import { BaseIncident } from '../engine/incidents/BaseIncident'

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
  }
}
