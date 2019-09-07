import { BaseIncident } from '../engine/incidents/BaseIncident'

export class GameIncident extends BaseIncident {
  constructor(options = {}) {
    super(options)
  }

  setPlayerStatus() {
    const playerSprite = this.mapGroup.getSpriteByName('player')

    if (this.playerStatus.fromDoor) {
      // Set player position to be next to from door
      switch (this.playerStatus.fromDoor) {
        case 'top':
          playerSprite.x = (this.game.width - playerSprite.width) / 2
          playerSprite.y = 3 * this.game.tileHeight
          break

        case 'bottom':
          playerSprite.x = (this.game.width - playerSprite.width) / 2
          playerSprite.y =
            this.game.height - this.game.tileHeight - playerSprite.height
          break

        case 'left':
          playerSprite.x = this.game.tileWidth
          playerSprite.y = (this.game.height - playerSprite.height) / 2
          break

        case 'right':
          playerSprite.x =
            this.game.width - this.game.tileWidth - playerSprite.width
          playerSprite.y = (this.game.height - playerSprite.height) / 2
          break

        default:
          throw new Error(
            `invalide from door direction: ${this.playerStatus.fromDoor}`
          )
      }
    }
  }
}
