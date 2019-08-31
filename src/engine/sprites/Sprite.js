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
    const hitMap = computeHit(this, objectSprite)
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
              objectSprite.x -= objectSprite.vMax
              objectSprite.vx = 0
            }
          }

          if (hitMap.right) {
            if (objectSprite.vx < 0) {
              objectSprite.x += objectSprite.vMax
              objectSprite.vx = 0
            }
          }

          if (hitMap.bottom) {
            if (objectSprite.vy < 0) {
              objectSprite.y += objectSprite.vMax
              objectSprite.vy = 0
            }
          }

          if (hitMap.top) {
            if (objectSprite.vy > 0) {
              objectSprite.y -= objectSprite.vMax
              objectSprite.vy = 0
            }
          }
        }
        break

      default:
        break
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
