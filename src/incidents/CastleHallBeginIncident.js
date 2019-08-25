import { createCastleHall } from '../maps/castle/createCastleHall'
import { BaseIncident } from '../engine/incidents/BaseIncident'

export class CastleHallBeginIncident extends BaseIncident {
  constructor(game, dt) {
    super(game, dt)
  }

  createMapData() {
    this.mapData = createCastleHall({
      tileWidth: this.game.pixelWidth / this.game.width,
      tileHeight: this.game.pixelHeight / this.game.height,
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
