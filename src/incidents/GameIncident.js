import { BaseIncident } from '../engine/incidents/BaseIncident'
import { random } from '../utils/random'

export class GameIncident extends BaseIncident {
  constructor(options = {}) {
    super(options)

    // TODO: use object width height to calculate player size and npc size!
    this.objectWidth = {
      xs: this.game.tileWidth / 2,
      s: this.game.tileWidth,
      m: this.game.tileWidth * 2,
      l: this.game.tileWidth * 3,
      xl: this.game.tileWidth * 4,
    }

    this.objectHeight = {
      xs: this.game.tileHeight / 2,
      s: this.game.tileHeight,
      m: this.game.tileHeight * 2,
      l: this.game.tileHeight * 3,
      xl: this.game.tileHeight * 4,
    }
  }

  // Hash function from binary string to array of doors.
  // For example, '1101' -> ['top', 'right', '', 'left']
  static hashDoor(hashStr = '') {
    const doorMap = ['top', 'right', 'bottom', 'left']

    // Make sure hashStr has four digits
    hashStr = '0000'.substring(hashStr.length) + hashStr

    return hashStr.split('').map((doorIndicator, index) => {
      if (doorIndicator === '1') {
        return doorMap[index]
      } else {
        return ''
      }
    })
  }

  static getOppositeDoor(door) {
    switch (door) {
      case 'top':
        return 'bottom'
      case 'right':
        return 'left'
      case 'bottom':
        return 'top'
      case 'left':
        return 'right'
      default:
        throw new Error(`invalid door: ${door}`)
    }
  }

  setPlayerStatus() {
    const playerSprite = this.mapGroup.getSpriteByName('player')

    if (this.playerStatus.fromDoor) {
      // Set player position to be next to from door
      switch (this.playerStatus.fromDoor) {
        case 'top':
          playerSprite.x = (this.width - playerSprite.width) / 2
          playerSprite.y = 3 * this.game.tileHeight
          break

        case 'bottom':
          playerSprite.x = (this.width - playerSprite.width) / 2
          playerSprite.y =
            this.height - this.game.tileHeight - playerSprite.height
          break

        case 'left':
          playerSprite.x = this.game.tileWidth
          playerSprite.y = (this.height - playerSprite.height) / 2
          break

        case 'right':
          playerSprite.x = this.width - this.game.tileWidth - playerSprite.width
          playerSprite.y = (this.height - playerSprite.height) / 2
          break

        default:
          throw new Error(
            `invalide from door direction: ${this.playerStatus.fromDoor}`
          )
      }
    }
  }
}
