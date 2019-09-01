import { computeHit } from '../utils/hitDetection'

export class Sprite {
  constructor() {
    Object.assign(this, {
      hitArea: {},
      hitMoveMap: {
        stop: this.hitMoveStop.bind(this),
      },
      type: 'sprite',
    })

    this.initAggregateHitMap()
  }
  // /**
  //  * process logic on collide with object sprite
  //  * @param {Sprite} objectSprite
  //  */
  // hitObject(objectSprite, reactType = 'stop') {
  //   let hitMap = computeHit(this, objectSprite)
  //   if (!hitMap.isHit) {
  //     return
  //   }

  //   switch (this.getLayerName()) {
  //     case 'background':
  //     case 'ground':
  //       // background and ground layers are accessible
  //       // do nothing here
  //       break

  //     case 'obstacles':
  //     case 'items':
  //       // obstacle layer cannot be passed by objects
  //       if (reactType === 'stop') {
  //         if (hitMap.left) {
  //           if (objectSprite.vx > 0) {
  //             objectSprite.x -= hitMap.left
  //             objectSprite.vx = 0
  //           }
  //         }

  //         if (hitMap.right) {
  //           if (objectSprite.vx < 0) {
  //             objectSprite.x += hitMap.right
  //             objectSprite.vx = 0
  //           }
  //         }

  //         hitMap = computeHit(this, objectSprite)

  //         if (hitMap.bottom) {
  //           if (objectSprite.vy < 0) {
  //             objectSprite.y += hitMap.bottom
  //             objectSprite.vy = 0
  //           }
  //         }

  //         if (hitMap.top) {
  //           if (objectSprite.vy > 0) {
  //             objectSprite.y -= hitMap.top
  //             objectSprite.vy = 0
  //           }
  //         }
  //       }
  //       break

  //     default:
  //       break
  //   }
  // }

  initAggregateHitMap() {
    this.aggregateHitMap = {
      right: [],
      left: [],
      top: [],
      bottom: [],
    }
  }

  // For object sprite hit tile/item sprite
  hitSprite(sprite) {
    // if (this.type === 'objectSprite' && sprite.hitObject) {
    //   sprite.hitObject(this)
    // }
    let hitMap = computeHit(this, sprite)
    if (!hitMap.isHit) {
      return
    }

    switch (sprite.getLayerName()) {
      case 'background':
      case 'ground':
        // background and ground layers are accessible
        // do nothing here
        break

      case 'obstacles':
      case 'items':
        // obstacle layer cannot be passed by objects
        if (hitMap.right) {
          if (this.vx > 0) {
            this.aggregateHitMap.right.push({
              sprite,
              value: hitMap.right,
              direction: 'right',
            })
          }
        }

        if (hitMap.left) {
          if (this.vx < 0) {
            this.aggregateHitMap.left.push({
              sprite,
              value: hitMap.left,
              direction: 'left',
            })
          }
        }

        if (hitMap.top) {
          if (this.vy < 0) {
            this.aggregateHitMap.top.push({
              sprite,
              value: hitMap.top,
              direction: 'top',
            })
          }
        }

        if (hitMap.bottom) {
          if (this.vy > 0) {
            this.aggregateHitMap.bottom.push({
              sprite,
              value: hitMap.bottom,
              direction: 'bottom',
            })
          }
        }
        break

      default:
        break
    }
  }

  hitSprites(sprites = []) {
    this.initAggregateHitMap()

    // Generate this.aggregateHitMap for smoothing hit results
    sprites.forEach(this.hitSprite.bind(this))
    const hitDirection = Object.keys(this.aggregateHitMap).sort(
      (directionA, directionB) => {
        return (
          this.aggregateHitMap[directionB].length -
          this.aggregateHitMap[directionA].length
        )
      }
    )[0]
    const actualHitSpriteObj = this.aggregateHitMap[hitDirection].sort(
      (hitA, hitB) => {
        return hitB.value - hitA.value
      }
    )[0]

    if (!actualHitSpriteObj) {
      return
    }

    this.hitMoveMap[actualHitSpriteObj.sprite.hitType](actualHitSpriteObj)
  }

  hitMoveStop({ value = 0, direction = '' }) {
    switch (direction) {
      case 'top':
        this.y += value
        this.vy = 0
        break

      case 'bottom':
        this.y -= value
        this.vy = 0
        break

      case 'left':
        this.x += value
        this.vx = 0
        break

      case 'right':
        this.x -= value
        this.vx = 0
        break

      default:
        throw new Error(`unexpected hit direction: ${direction}`)
    }
  }

  getLayerName() {
    let parent = this.parent
    while (parent && parent.type !== 'layer') {
      parent = parent.parent
    }

    return parent.name
  }

  update(dt) {}

  render(renderer, dt) {}
}
