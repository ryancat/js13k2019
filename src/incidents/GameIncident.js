import { BaseIncident } from '../engine/incidents/BaseIncident'
import { random } from '../utils/random'

export class GameIncident extends BaseIncident {
  constructor(options = {}) {
    super(options)
  }

  // Hash function from binary string to array of doors.
  // For example, '1101' -> ['top', 'right', '', 'left']
  static hashDoor(hashStr = '') {
    const doorMap = ['top', 'right', 'bottom', 'left']
    // hashStr.split('').forEach((doorIndicator, index) => {
    //   if (doorIndicator === '1') {
    //     result.push(doorMap[index])
    //   }
    // })

    return hashStr.split('').map((doorIndicator, index) => {
      if (doorIndicator === '1') {
        return doorMap[index]
      } else {
        return ''
      }
    })
  }

  static generateRandomDoors() {
    // TODO replace this with a determinastic random method
    // See https://stackoverflow.com/questions/424292/seedable-javascript-random-number-generator
    return this.hashDoor(Math.floor(random.nextFloat() * 16).toString(2))
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
