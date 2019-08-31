import { RectSprite } from '../engine/sprites/RectSprite'
import { FrameSprite } from '../engine/sprites/FrameSprite'
import { palette } from '../utils/colors'
import { Game } from '../engine/Game'

export class EmptySprite extends RectSprite {
  constructor(options = {}) {
    // Update sprite details
    options.opacity = 0

    // construct sprite using base sprite
    super(options)
  }

  // empty sprite don't render anything
  render() {}
}

export class CastleHallGroundSprite extends RectSprite {
  constructor(options = {}) {
    // Update sprite details
    options.backgroundColor = options.backgroundColor || palette.gunmetal[3]

    // construct sprite using base sprite
    super(options)
  }
}

export class CastleHallWallSprite extends RectSprite {
  constructor(options = {}) {
    // Update sprite details
    options.backgroundColor = options.backgroundColor || palette.brown[3]

    // construct sprite using base sprite
    super(options)

    this.name = 'wall'
  }
}

export class CastleHallExitSprite extends RectSprite {
  constructor(options = {}) {
    // Update sprite details
    options.backgroundColor = options.backgroundColor || palette.green[3]

    // construct sprite using base sprite
    super(options)
  }
}

export class CastleHallWallTopSprite extends RectSprite {
  constructor(options = {}) {
    // Update sprite details
    options.backgroundColor = options.backgroundColor || palette.brown[1]

    // construct sprite using base sprite
    super(options)
  }
}

export class PlaceholderSprite extends RectSprite {
  constructor(options = {}) {
    // Update sprite details
    options.backgroundColor = options.backgroundColor || palette.gunmetal[0]

    // construct sprite using base sprite
    super(options)
  }
}

export class CastleHallBackgroundSprite extends RectSprite {
  constructor(options = {}) {
    // Update sprite details
    options.backgroundColor = options.backgroundColor || palette.gunmetal[4]
    options.opacity = options.opacity || 0

    // construct sprite using base sprite
    super(options)
  }
}

// TODO: the king has multiple sprites, which is not ideal for hit detection.
// We should either use object layer, or create a group and allow hit detection
// happen in group level.
// The problem is the map json data already split king into several sprites,
// which makes it hard to describe which sprites should be grouped together.
// I think I need to change the tileSpriteMap on mapData to do that.
export class CastleHallKingSprite extends RectSprite {
  constructor(options = {}) {
    // Update sprite details
    options.backgroundColor = options.backgroundColor || palette.blue[2]

    // construct sprite using base sprite
    super(options)

    this.name = 'king'
  }
}

// Object sprite frames
export class PlayerSprite1 extends RectSprite {
  constructor(options = {}) {
    // Update sprite details
    options.backgroundColor = options.backgroundColor || palette.brown[0]

    // construct sprite using base sprite
    super(options)

    this.setHitArea({
      localX: 0,
      localY: this.height / 2,
      localWidth: this.width,
      localHeight: this.height / 2,
    })

    // set velocity
    this.vx = 0
    this.vy = 0
    // sqrt rule applies here
    // pixel per 1 ms
    this.vMax = 16

    // // the action queue that will update sprite movement
    // this._actionQ = []
  }

  hitSprite(sprite) {
    if (sprite.hitObject) {
      sprite.hitObject(this)
    }
  }

  hitSprites(sprites = []) {
    sprites.forEach(this.hitSprite.bind(this))
  }

  // addToActionQ(actionItem = {}) {
  //   this._actionQ.push(actionItem)
  // }

  // runActionQ() {
  //   if (!this._actionQ.length) {
  //     return
  //   }

  //   const finalAction = this._actionQ.reduce((preAction, postAction) => {
  //     return {
  //       vx: preAction.vx + postAction.vx,
  //       vy: preAction.vy + postAction.vy,
  //     }
  //   })

  //   const bothVxAndVy = finalAction.vx && finalAction.vy
  //   this.vx = bothVxAndVy
  //     ? ((finalAction.vx / Math.abs(finalAction.vx)) * this.vMax) / Math.sqrt(2)
  //     : finalAction.vx
  //   this.vy = bothVxAndVy
  //     ? ((finalAction.vy / Math.abs(finalAction.vy)) * this.vMax) / Math.sqrt(2)
  //     : finalAction.vy
  //   this.x += this.vx
  //   this.y += this.vy
  // }
}

export class PlayerSprite2 extends RectSprite {
  constructor(options = {}) {
    // Update sprite details
    options.backgroundColor = options.backgroundColor || palette.red[4]

    // construct sprite using base sprite
    super(options)

    this.setHitArea({
      localX: 0,
      localY: this.height / 2,
      localWidth: this.width,
      localHeight: this.height / 2,
    })

    // set velocity
    this.vx = 0
    this.vy = 0
    // sqrt rule applies here
    // pixel per 1 ms
    this.vMax = 16

    // // the action queue that will update sprite movement
    // this._actionQ = []
  }

  move() {
    this.y += this.vy
    this.x += this.vx
  }

  hitSprite(sprite) {
    if (sprite.hitObject) {
      sprite.hitObject(this)
    }
  }

  hitSprites(sprites = []) {
    sprites.forEach(this.hitSprite.bind(this))
  }

  // addToActionQ(actionItem = {}) {
  //   this._actionQ.push(actionItem)
  // }

  // runActionQ() {
  //   if (!this._actionQ.length) {
  //     return
  //   }

  //   const finalAction = this._actionQ.reduce((preAction, postAction) => {
  //     return {
  //       vx: preAction.vx + postAction.vx,
  //       vy: preAction.vy + postAction.vy,
  //     }
  //   })

  //   const bothVxAndVy = finalAction.vx && finalAction.vy
  //   this.vx = bothVxAndVy
  //     ? ((finalAction.vx / Math.abs(finalAction.vx)) * this.vMax) / Math.sqrt(2)
  //     : finalAction.vx
  //   this.vy = bothVxAndVy
  //     ? ((finalAction.vy / Math.abs(finalAction.vy)) * this.vMax) / Math.sqrt(2)
  //     : finalAction.vy
  //   this.x += this.vx
  //   this.y += this.vy
  // }
}

// TODO: add factory code for creating RectSprite for player
export class PlayerSprite extends FrameSprite {
  constructor(options = {}) {
    // construct sprite using base sprite
    super({
      ...options,
      orderedFrames: [
        Game.createSprite('PlayerSprite1', options),
        Game.createSprite('PlayerSprite2', options),
      ],
    })

    // set velocity
    this.vx = 0
    this.vy = 0
    // sqrt rule applies here
    // pixel per 1 ms
    this.vMax = 16

    // // the action queue that will update sprite movement
    // this._actionQ = []
  }

  setHitArea() {}

  move() {
    this.moveTo(this.x + this.vx, this.y + this.vy)
  }

  hitSprite(sprite) {
    if (sprite.hitObject) {
      sprite.hitObject(this)
    }
  }

  hitSprites(sprites = []) {
    sprites.forEach(this.hitSprite.bind(this))
  }

  // addToActionQ(actionItem = {}) {
  //   this._actionQ.push(actionItem)
  // }

  // runActionQ() {
  //   if (!this._actionQ.length) {
  //     return
  //   }

  //   const finalAction = this._actionQ.reduce((preAction, postAction) => {
  //     return {
  //       vx: preAction.vx + postAction.vx,
  //       vy: preAction.vy + postAction.vy,
  //     }
  //   })

  //   const bothVxAndVy = finalAction.vx && finalAction.vy
  //   this.vx = bothVxAndVy
  //     ? ((finalAction.vx / Math.abs(finalAction.vx)) * this.vMax) / Math.sqrt(2)
  //     : finalAction.vx
  //   this.vy = bothVxAndVy
  //     ? ((finalAction.vy / Math.abs(finalAction.vy)) * this.vMax) / Math.sqrt(2)
  //     : finalAction.vy
  //   this.x += this.vx
  //   this.y += this.vy
  // }
}
