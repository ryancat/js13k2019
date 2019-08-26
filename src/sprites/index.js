import { RectSprite } from '../engine/sprites/RectSprite'
import { palette } from '../utils/colors'

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
export class PlayerSprite extends RectSprite {
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
    this.vMax = 20
  }
}
