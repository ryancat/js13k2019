import { computeHit } from '../utils/hitDetection'

export class Sprite {
  constructor() {
    Object.assign(this, {
      hitArea: {},
      hitMoveMap: {
        stop: this.hitMoveStop.bind(this),
        pass: () => {},
      },
      type: 'sprite',
      hitType: 'pass',
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
    if (sprite === this && sprite.hitType === 'pass') {
      // Cannot hit self
      return
    }
    // if (this.type === 'objectSprite' && sprite.hitObject) {
    //   sprite.hitObject(this)
    // }
    let hitMap = computeHit(this, sprite)

    if (!hitMap.isHit) {
      return
    }

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

    // switch (sprite.layer.name) {
    //   case 'background':
    //   case 'ground':
    //     // background and ground layers are accessible
    //     // do nothing here
    //     break

    //   case 'obstacles':
    //   case 'items':
    //     // obstacle layer cannot be passed by objects
    //     if (hitMap.right) {
    //       if (this.vx > 0) {
    //         this.aggregateHitMap.right.push({
    //           sprite,
    //           value: hitMap.right,
    //           direction: 'right',
    //         })
    //       }
    //     }

    //     if (hitMap.left) {
    //       if (this.vx < 0) {
    //         this.aggregateHitMap.left.push({
    //           sprite,
    //           value: hitMap.left,
    //           direction: 'left',
    //         })
    //       }
    //     }

    //     if (hitMap.top) {
    //       if (this.vy < 0) {
    //         this.aggregateHitMap.top.push({
    //           sprite,
    //           value: hitMap.top,
    //           direction: 'top',
    //         })
    //       }
    //     }

    //     if (hitMap.bottom) {
    //       if (this.vy > 0) {
    //         this.aggregateHitMap.bottom.push({
    //           sprite,
    //           value: hitMap.bottom,
    //           direction: 'bottom',
    //         })
    //       }
    //     }
    //     break

    //   default:
    //     break
    // }
  }

  hitSprites(sprites = []) {
    this.initAggregateHitMap()

    // Generate this.aggregateHitMap for smoothing hit results
    sprites.forEach(this.hitSprite.bind(this))

    // // The hitDirection is decided by most number of blocking sprites
    // const hitDirections = Object.keys(this.aggregateHitMap).sort(
    //   (directionA, directionB) => {
    //     return (
    //       this.aggregateHitMap[directionB].length -
    //       this.aggregateHitMap[directionA].length
    //     )
    //   }
    // )

    // const lrHitDirection =
    //   this.aggregateHitMap.left.length > this.aggregateHitMap.right.length
    //     ? 'left'
    //     : 'right'
    // const tbHitDirection =
    //   this.aggregateHitMap.top.length > this.aggregateHitMap.bottom.length
    //     ? 'top'
    //     : 'bottom'

    // const lrActualHitSpirteObj = this.aggregateHitMap[lrHitDirection].sort(
    //   (hitA, hitB) => {
    //     return hitB.value - hitA.value
    //   }
    // )[0]
    // const tbActualHitSpirteObj = this.aggregateHitMap[tbHitDirection].sort(
    //   (hitA, hitB) => {
    //     return hitB.value - hitA.value
    //   }
    // )[0]

    // if (lrActualHitSpirteObj) {
    //   this.hitMoveMap[lrActualHitSpirteObj.sprite.hitType](lrActualHitSpirteObj)
    // }

    // if (tbActualHitSpirteObj) {
    //   this.hitMoveMap[tbActualHitSpirteObj.sprite.hitType](tbActualHitSpirteObj)
    // }

    // console.log(this.aggregateHitMap)

    // this.hitMoveMap[actualHitSpriteObj.sprite.hitType](actualHitSpriteObj)

    // The hitDirection is decided by most number of blocking sprites
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

    if (localStorage.getItem('GAME_DEBUG_MODE')) {
      console.log(actualHitSpriteObj)
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

  // Move the sprite with current speed, and hit detection
  move() {
    if (this.type === 'tileSprite') {
      // Tile sprites cannot move
      return
    }

    this.x += this.vx
    this.checkHitSprites()

    this.y += this.vy
    this.checkHitSprites()
  }

  checkHitSprites() {
    // Only check surranding sprites with current sprite
    this.hitSprites(this.getPossibleHitSprites())
  }

  // Get the surranding sprites.
  // Since we are tile based, it's super easy to do so than arbitrary
  // sprites (may need to use quad tree for that)
  getPossibleHitSprites() {
    const colNumPerPixel = this.map.colNum / this.map.width
    const rowNumPerPixel = this.map.rowNum / this.map.height
    const hitArea = this.hitArea
    const startColIndex = Math.floor((this.x + hitArea.localX) * colNumPerPixel)
    const endColIndex = Math.floor(
      (this.x + hitArea.localX + hitArea.localWidth) * colNumPerPixel
    )
    const startRowIndex = Math.floor((this.y + hitArea.localY) * rowNumPerPixel)
    const endRowIndex = Math.floor(
      (this.y + hitArea.localY + hitArea.localHeight) * rowNumPerPixel
    )

    const spriteIndexes = []
    for (let rowIndex = startRowIndex; rowIndex <= endRowIndex; rowIndex++) {
      for (let colIndex = startColIndex; colIndex <= endColIndex; colIndex++) {
        spriteIndexes.push(rowIndex * this.map.colNum + colIndex)
      }
    }

    let possibleHitSprites = []
    spriteIndexes.forEach(spriteIndex => {
      const layerGroups = this.map.children
      layerGroups.forEach(layer => {
        if (layer.name === 'objects') {
          // This is when we detect other objects with current objects.
          // This can be optimized by quad tree
          possibleHitSprites = possibleHitSprites.concat(layer.children)
        } else if (
          ['obstacles', 'items'].indexOf(layer.name) >= 0 &&
          layer.children[spriteIndex] &&
          layer.children[spriteIndex].name !== 'empty'
        ) {
          // Assume all other layers are filled with tiles
          possibleHitSprites.push(layer.children[spriteIndex])
        }
      })
    })

    return possibleHitSprites
  }

  // getLayer() {
  //   let parent = this.parent
  //   while (parent && parent.type !== 'layer') {
  //     parent = parent.parent
  //   }

  //   return parent
  // }

  // getMap() {
  //   let parent = this.parent
  //   while (parent && parent.type !== 'map') {
  //     parent = parent.parent
  //   }

  //   return parent
  // }

  update(dt) {}

  render(renderer, dt) {}
}
