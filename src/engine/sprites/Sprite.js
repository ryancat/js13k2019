import { computeHit } from '../utils/hitDetection'

const DEFAULT_SPRITE_WIDTH = 50
const DEFAULT_SPRITE_HEIGHT = 50

export class Sprite {
  constructor(options = {}) {
    Object.assign(
      this,
      {
        x: 0,
        y: 0,
        width: DEFAULT_SPRITE_WIDTH,
        height: DEFAULT_SPRITE_HEIGHT,
        // offset dimensions from parent scene
        offsetX: 0,
        offsetY: 0,
        // TODO: have engine level palette
        backgroundColor: 'red',
        name: '',
        hitArea: {},
        hitMoveMap: {
          stop: this.hitMoveStop.bind(this),
          pass: () => {},
        },
        type: 'sprite',
        disableHit: false,
        hitType: 'pass',
        scene: null,
      },
      options
    )

    this.initAggregateHitMap()
  }

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
    if (sprite === this || sprite.hitType === 'pass' || sprite.disableHit) {
      // Cannot hit self or sprite that not supposed to be hit
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
  }

  hitSprites(sprites = []) {
    this.initAggregateHitMap()

    // Generate this.aggregateHitMap for smoothing hit results
    sprites.forEach(this.hitSprite.bind(this))

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

    const actualHitSprite = actualHitSpriteObj.sprite
    // Handle hit move response
    this.hitMoveMap[actualHitSprite.hitType](actualHitSpriteObj)

    // Handle hit callbacks
    actualHitSprite.hitCallback(this)
    if (actualHitSprite.scene) {
      actualHitSprite.scene.hitCallback(this)
    }
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

  hitCallback(sprite) {}

  update(dt) {}

  render(renderer, dt) {}
}
