import { generateMapData } from '../maps/castle/createCastleHall'
import { BaseIncident } from '../engine/incidents/BaseIncident'
import { hitTestRects } from '../engine/utils/hitDetection'
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
    const kingSprites = this.mapGroup.getSpritesByName('king')
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

    const oldPosition = {
      x: playerSprite.x,
      y: playerSprite.y,
    }
    // console.log(oldPosition)

    playerSprite.move()
    // console.log(playerSprite.x, playerSprite.y)

    // hit detection
    playerSprite.hitSprites(wallSprites)
    playerSprite.hitSprites(kingSprites)

    // if (hitTestRects(playerSprite, kingSprites)) {
    //   console.log('hit king')
    // }

    // if (hitTestRects(playerSprite, wallSprites)) {
    //   // if (upKey.isDown || downKey.isDown) {
    //   //   playerSprite.y -= playerSprite.vy
    //   //   playerSprite.vy = 0
    //   // }
    //   playerSprite.x = oldPosition.x
    //   playerSprite.y = oldPosition.y
    // }

    // // if (Game.hitTestRects(playerSprite, wallSprites)) {
    // //   // if (leftKey.isDown || rightKey.isDown) {
    // //   //   playerSprite.x -= playerSprite.vx
    // //   //   playerSprite.vx = 0
    // //   // }
    // // }
  }
}
