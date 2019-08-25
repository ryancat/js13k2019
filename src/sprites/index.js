import { palette } from '../utils/colors'

const DEFAULT_RECT_SPRITE_WIDTH = 50
const DEFAULT_RECT_SPRITE_HEIGHT = 50

class RectSprite {
  constructor(options = {}) {
    Object.assign(
      this,
      {
        x: 0,
        y: 0,
        pixelWidth: DEFAULT_RECT_SPRITE_WIDTH,
        pixelHeight: DEFAULT_RECT_SPRITE_HEIGHT,
        backgroundColor: palette.gunmetal[4],
        type: 'sprite',
      },
      options
    )
  }

  update(dt) {}

  render(renderer) {
    renderer.drawRect({
      x: this.x,
      y: this.y,
      pixelWidth: this.pixelWidth,
      pixelHeight: this.pixelHeight,
      backgroundColor: this.backgroundColor,
    })
  }
}

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

export class CastleHallKingSprite extends RectSprite {
  constructor(options = {}) {
    // Update sprite details
    options.backgroundColor = options.backgroundColor || palette.blue[2]

    // construct sprite using base sprite
    super(options)
  }
}

// Object sprite frames
export class PlayerSprite extends RectSprite {
  constructor(options = {}) {
    // Update sprite details
    options.backgroundColor = options.backgroundColor || palette.brown[0]

    // construct sprite using base sprite
    super(options)
  }
}
