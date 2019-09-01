import { computeHit } from '../utils/hitDetection'

export class Sprite {
  constructor() {
    Object.assign(this, {
      hitArea: {},
      type: 'sprite',
    })
  }
  /**
   * process logic on collide with object sprite
   * @param {Sprite} objectSprite
   */
  hitObject(objectSprite, reactType = 'stop') {
    let hitMap = computeHit(this, objectSprite)
    if (!hitMap.isHit) {
      return
    }

    switch (this.getLayerName()) {
      case 'background':
      case 'ground':
        // background and ground layers are accessible
        // do nothing here
        break

      case 'obstacles':
      case 'items':
        // obstacle layer cannot be passed by objects
        if (reactType === 'stop') {
          if (hitMap.left) {
            if (objectSprite.vx > 0) {
              objectSprite.x -= hitMap.left
              objectSprite.vx = 0
            }
          }

          if (hitMap.right) {
            if (objectSprite.vx < 0) {
              objectSprite.x += hitMap.right
              objectSprite.vx = 0
            }
          }

          hitMap = computeHit(this, objectSprite)

          if (hitMap.bottom) {
            if (objectSprite.vy < 0) {
              objectSprite.y += hitMap.bottom
              objectSprite.vy = 0
            }
          }

          if (hitMap.top) {
            if (objectSprite.vy > 0) {
              objectSprite.y -= hitMap.top
              objectSprite.vy = 0
            }
          }
        }
        break

      default:
        break
    }
  }

  // For object sprite hit tile/item sprite
  hitSprite(sprite) {
    if (this.type === 'objectSprite' && sprite.hitObject) {
      sprite.hitObject(this)
    }
  }

  hitSprites(sprites = []) {
    sprites.forEach(this.hitSprite.bind(this))
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
